/**
 * NodeJS SMTP Client
 */
const nodemailer = require('nodemailer');


class NodemailerLib {

  constructor() {
    this.transporter;
  }


  /**
   * Create nodemailer transporter.
   * @param {object} config_smtp - {host, port, secure, auth}
   */
  async trans(config_smtp) {

    // create fake SMTP for test purposes: https://ethereal.email
    if (!config_smtp) {
      const testAccount = await nodemailer.createTestAccount();
      config_smtp = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      };
    }

    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport(config_smtp);
  }


  /**
   * @param {String} from - '"Fred Foo 👻" <foo@example.com>'
   * @param {String} to - receiver email(s) 'bar@example.com, baz@example.com'
   * @param {String} sub - email subject
   * @param {String} htm - email message in HTML format
   * @param {String} txt - email message in TEXT format
   * @return {Promise}
   */
  async sendEmail(from, to, subject, html, text) {
    const dataSMTP = await this.transporter.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
      text, // plain text body
    });
    return dataSMTP;
  }


}



module.exports = new NodemailerLib();
