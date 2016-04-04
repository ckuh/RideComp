var Uber = require('node-uber');

var uber = new Uber({
  client_id: 'Ub-nX1LYdXi8i4QZf2T2M1tNmKjWPoRY',
  client_secret: 'iyyblJ3FDlhoxs1AMNNPk3opuiP8G2rwozr4wtxw',
  server_token: 'E8JvoeqbCbk5MwvXzCF7uXxZngZgcAFrTASjr61q',
  name: 'RideComp'
});

// uber.authorization({
//     authorization_code: 'SOME AUTH CODE'
//   },
//   function(err, accessToken, refreshToken) {
//     uber.user.profile(accessToken, function(err, res) {
//       console.log('inside config err: ' + err);
//       console.log('inside config res: ' + res);
//     });
//   });

module.exports = {
  uber: uber
};
