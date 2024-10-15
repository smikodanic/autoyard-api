const postmark = require('postmark');
const env = global.api.env;


/**
 * Send email via Postmark SMTP API.
 * @param {string} From - sasa@mikosoft.info
 * @param {string} To - sasa@mikosoft.info
 * @param {string} ReplyTo - john-doe@example.com
 * @param {string} Subject - 'First message'
 * @param {string} HtmlBody - 'Some <b>message</b>'
 * @param {string} TextBody - Some message
 */
module.exports.sendEmail = async (From, To, ReplyTo, Subject, HtmlBody, TextBody) => {
  const client = new postmark.ServerClient(env.postmark_api_token);
  const postmarkResp = await client.sendEmail({ From, To, ReplyTo, Subject, HtmlBody, TextBody }); // {To: 'info@dex8.com',SubmittedAt: '2023-09-24T14:19:44.7772335Z',MessageID: 'f3835d91-443e-4f8f-bb2c-99765224de85',ErrorCode: 0,Message: 'OK'}
  return postmarkResp;
};
