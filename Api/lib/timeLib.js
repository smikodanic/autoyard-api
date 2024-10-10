const moment = require('moment');


class TimeLib {

  /**
   * Get present time in short format: 21.7.2020 9:3:29
   */
  shortNow() {
    return moment().format('D.M.YYYY h:m:s');
  }


  /**
   * Format current time in the ISO string: 2020-07-21T07:03:28.250Z
   */
  isoNow() {
    return moment().toISOString();
  }



  async sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
  }


  /**
   * Convert seconds to more human readable string
   * @param  {Number} seconds - number of seconds
   * @return {String}
   */
  secondsToHumanReadable(seconds) {
    const numdays = Math.floor(seconds / 86400);
    const numhours = Math.floor((seconds % 86400) / 3600);
    const numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    const numseconds = ((seconds % 86400) % 3600) % 60;
    return numdays + ' days ' + numhours + ' hours ' + numminutes + ' minutes ' + numseconds + ' seconds';
  }


  /**
   * Convert seconds to more human readable string
   * @param  {[type]} seconds [description]
   * @return {[type]}         [description]
   */
  secondsToHuman(seconds) {
    let secRest;

    const days = Math.floor(seconds / (24 * 60 * 60));
    secRest = seconds % (24 * 60 * 60);

    const hours = Math.floor(secRest / (60 * 60));
    secRest = secRest % (60 * 60);

    const mins = Math.floor(secRest / 60);
    secRest = secRest % 60;

    const secs = secRest;

    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }


  getCurrentYYYYMMDD() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }



}




module.exports = new TimeLib();
