const mongoose = require('mongoose');
const CommonMethods = require('./mutual/CommonMethods.js');
const options = require('./mutual/options');




class Theparking_eu extends CommonMethods {

  constructor() {
    super();
    this.initSchemaModel();
  }


  initSchemaModel() {
    const collection = 'theparking_eu';

    /*** SCHEMA ***/
    const opts = { ...options, collection };
    const schema = new mongoose.Schema({
      searchpage_num: Number,
      searchpage_url: String, // https://www.theparking.eu/#!/used-cars/VW-golf.html
      car_detail_url: String, // https://www.theparking.eu/used-cars-detail/volkswagen-golf-sw-r/volkswagen-golf-2-0tsi-4m-avt-r-320-navi-kam-alu-lane-acc-2022-god/OL141Z2S.html',
      redirect_url: String, // https://www.theparking.eu/tools/A2FVZVFZ/0/P/P.html
      make: String, // Volkswagen
      model: String, // Golf
      version: String, // Gte 1.4
      location: String, // Germany
      fuel: String, // Gasoline
      mileage: String, // 17,608 Km,
      year: Number,
      transmission: String, // manual
      color: String, // red
      doors: String, // '5'
      category: String, // compact
      ad_title: String, // "vw golf vii 7 r line, letnik 2015, 138000 km, diesel 2.0 110kw deli"
      date_published: Date, // date when add was published ISODate("2023-03-21T00:00:00.000+0000")
    }, opts);


    /*** MODEL ***/
    this.model = mongoose.model(`${collection}MD`, schema);
  }


}



module.exports = new Theparking_eu();
