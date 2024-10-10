/**
 * Methods common for all models.
 */
class CommonMethods {

  constructor() {

  }


  // add new doc
  add(doc) {
    return this.model.create(doc);
  }


  // save method
  save(docObj) {
    const doc = new this.model(docObj);
    return doc.save();
  }


  // count and list docs for 'moQuery'
  list(moQuery, limit, skip, sort, select) {
    return this.model
      .countDocuments(moQuery)
      .then(resultsNum => {
        return this.model
          .find(moQuery)
          .limit(limit)
          .skip(skip)
          .sort(sort)
          .select(select)
          .exec()
          .then(resultsArr => {
            const results = {
              success: true,
              count: resultsNum,
              data: resultsArr
            };
            return results;
          });
      });
  }


  // do not count but list docs for 'moQuery'
  listFast(moQuery, limit, skip, sort, select) {
    return this.model
      .find(moQuery)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .select(select);
  }


  // delete one doc
  // First find doc, then delete doc. This is because doc.deleteOne() activate post middleware. modelName.findOneAndRemove() doesn't activate middleware.
  deleteOne(moQuery) {
    return this.model.findOne(moQuery)
      .then(doc => {
        if (!doc) { throw new Error('Doc does not exist for specified query!'); }
        return doc.deleteOne();
      });
  }


  // delete multiple docs
  deleteMultiple(moQuery) {
    return this.model.deleteMany(moQuery);
  }


  // get doc
  getOne(moQuery, sort, select) {
    return this.model
      .findOne(moQuery)
      .sort(sort)
      .select(select)
      .exec();
  }


  // update a doc
  editOne(moQuery, docNew, updOpts) {
    if (!updOpts) {
      // default options https://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
      updOpts = {
        new: true, // return newly updated doc
        upsert: false, // whether to create the doc if it doesn't match (false)
        fields: false, // which fields to select. Equivalent to .select(fields).findOneAndUpdate()
        sort: false, // how to sort fields
        runValidators: true, // validators validate the update operation against the model's schema
      };
    }

    return this.model.findOneAndUpdate(moQuery, docNew, updOpts).exec();
  }


  // update multiple documents
  editMultiple(moQuery, docNew, updOpts) {
    if (!updOpts) {
      // default options https://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
      updOpts = {
        strict: true,
        upsert: false,
        writeConcern: null,
        omitUndefined: false
      };
    }

    return this.model.updateMany(moQuery, docNew, updOpts);
  }


  // count number of docs
  countDocs(moQuery) {
    return this.model.countDocuments(moQuery)
      .then(count => +count || 0); // + is converting string into number
  }





}




module.exports = CommonMethods;
