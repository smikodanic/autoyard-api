To create an index for full-text search on a table where the `make` and `model` are stored in separate tables but referenced via `make_id` and `model_id`, you can follow these steps:

---

### 1. **Combine Columns into a Full-Text Search Vector**
You need a combined field in the `cars` table that includes the `make`, `model`, and `ad_title` text. This can be achieved by creating a generated column or a materialized view.

#### Option 1: Generated Column
You can create a generated column in the `cars` table that dynamically combines the `make`, `model`, and `ad_title` into a single field for indexing.

```sql
ALTER TABLE cars ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', ad_title), 'A') ||
  setweight(to_tsvector('english', COALESCE(
    (SELECT name FROM makes WHERE makes.make_id = cars.make_id), ''
  )), 'B') ||
  setweight(to_tsvector('english', COALESCE(
    (SELECT name FROM models WHERE models.model_id = cars.model_id), ''
  )), 'C')
) STORED;
```

This:
- Uses the `ad_title` from the `cars` table.
- Adds the `name` from the `makes` and `models` tables based on the `make_id` and `model_id` foreign keys.
- Combines them into a `tsvector` column named `search_vector`.

#### Option 2: Materialized View
Alternatively, create a materialized view that precomputes this data:

```sql
CREATE MATERIALIZED VIEW cars_search AS
SELECT
  cars.car_id,
  setweight(to_tsvector('english', cars.ad_title), 'A') ||
  setweight(to_tsvector('english', COALESCE(makes.name, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(models.name, '')), 'C') AS search_vector
FROM cars
LEFT JOIN makes ON cars.make_id = makes.make_id
LEFT JOIN models ON cars.model_id = models.model_id;
```

You’ll need to refresh the materialized view when the `makes` or `models` tables change.

---

### 2. **Create the Full-Text Index**
Once you have the `search_vector`, create a GIN (Generalized Inverted Index) index on it for efficient full-text search.

```sql
CREATE INDEX cars_search_vector_idx ON cars USING GIN (search_vector);
```

Or, if you're using a materialized view:
```sql
CREATE INDEX cars_search_vector_idx ON cars_search USING GIN (search_vector);
```

---

### 3. **Perform Full-Text Search**
Use the `@@` operator to query the `search_vector`.

#### Example Query:
```sql
SELECT *
FROM cars
WHERE search_vector @@ plainto_tsquery('english', 'toyota corolla sedan');
```

This matches any `cars` entry where the `ad_title`, `make`, or `model` contains the terms `toyota`, `corolla`, and `sedan`.

---

### 4. **Handling Updates**
- For the **generated column**, the `search_vector` is automatically updated when the `ad_title`, `make_id`, or `model_id` changes.
- For the **materialized view**, you need to refresh it when related data changes:
  ```sql
  REFRESH MATERIALIZED VIEW cars_search;
  ```

---

### 5. **Optional: Weighting**
You can assign weights (`A`, `B`, `C`, etc.) to give more importance to certain fields (e.g., prioritize `ad_title` over `make` and `model`).

- `setweight(to_tsvector('english', ad_title), 'A')`: High importance to `ad_title`.
- `setweight(to_tsvector('english', make_name), 'B')`: Medium importance to `make`.
- `setweight(to_tsvector('english', model_name), 'C')`: Lower importance to `model`.

---

This approach ensures that your full-text search incorporates all relevant fields while maintaining normalized relationships between `cars`, `makes`, and `models`.
