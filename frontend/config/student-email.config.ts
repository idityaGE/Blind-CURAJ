/** Example
 * @email : 2023btcse002@curaj.ac.in
 * -->
 * @localPart : 2023btcse002
 * @separator : @ 
 * @domainName : curaj.ac.in
 */

export const studentEmailConfig = {
  college: {
    name: 'Central University of Rajasthan',
    shortHand: 'CURAJ',
  },
  localPart: {
    example: "2023BTCSE017", // enrollment ID
    regex: /^\d{4}[A-Za-z]+\d{3}$/,  // generated regex for enrollment ID using chatgpt
  },
  domainName: 'curaj.ac.in',
  support_email: '@'
}
