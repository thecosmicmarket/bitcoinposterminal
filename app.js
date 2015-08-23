var app = angular.module('app', ['ngMaterial']).controller('appController', function($scope, $timeout, $http) {
    $scope.app = {};
    $scope.app.showDefaultScreen = true;
    $scope.app.showPaymentButton = false;
    $scope.app.showCoinbaseFrame = false;
    $scope.app.backgroundClass = "colorCycle";
    $scope.app.totalamount = 0;
    $scope.app.coinbase_url = "";
    $scope.a = 1;

    var showBitcoinButton = function(amount) {
      $timeout(function() {
        $scope.app.totalamount = amount;
        $scope.app.showDefaultScreen = false;
        $scope.app.showPaymentButton = true;
        $scope.app.backgroundClass = "backgroundgray";
      }, 20, true);
      
    };

    var hideBitcoinButton = function() {
      $timeout(function() {
        $scope.app.showDefaultScreen = true;
        $scope.app.showPaymentButton = false;
        $scope.app.backgroundClass = "colorCycle";
        $scope.app.showCoinbaseFrame = false;
      }, 20, true);
      
    };
    
    $scope.activateCoinbaseFrame = function() {
      $scope.app.showPaymentButton = false;
      $scope.app.showCoinbaseFrame = true;
      coinbaseCheckoutCreate();
    };
    
    var _generateSignature = function (url, bodyStr) {
      var nonce     = Math.floor(Date.now() / 1000);
      var message   = String(nonce) +"POST"+ "/v2/checkouts" + bodyStr;
      var signature =  CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, apiSecret).update(message).finalize().toString(CryptoJS.enc.Hex);
      return {"nonce": nonce, "digest": signature};
    };

    var coinbaseCheckoutCreate = function() {
      var url = "https://api.coinbase.com/v2/checkouts";
      var reqBody = {
          "amount":  $scope.app.totalamount,
          "currency": "USD",
          "name": "Cosmic Market Bitcoin Checkout",
          "description": "Store order",
          "type": "order",
          "customer_defined_amount": false,
          "collect_email": false,
          "metadata": {
             "product_id": (new Date()).getTime()/1000
          }
      };
      
      var sig = _generateSignature(url, angular.toJson(reqBody));
      
      var req = {
          method : 'POST',
         'url': url,
         'headers': {
           'Content-Type': "application/json",
           'CB-ACCESS-KEY': apiKey,
           'CB-ACCESS-SIGN' : sig.digest,
           'CB-ACCESS-TIMESTAMP' : sig.nonce
         },
         'data': reqBody
      };
      
      $http(req).success(
          function(data, status){
              var webview = document.querySelector('#coinbase');
              webview.setZoom(2.0);
              webview.src = "https://www.coinbase.com/checkouts/"+data.data.embed_code+"/inline";
          }).error(
            function(data, status){
              
          });
    };


    var startMulticast = function() {
      
       chrome.sockets.udp.create({bufferSize: 1024 * 1024}, function (createInfo) {
        var socketId = createInfo.socketId;
        var ttl = 12;
        chrome.sockets.udp.setMulticastTimeToLive(socketId, ttl, function (result) {
          if (result !== 0) {
            console.log("Set TTL Error: Unknown error");
          }
          chrome.sockets.udp.bind(socketId, "0.0.0.0", 14001, function (result) {
            if (result !== 0) {
              chrome.sockets.udp.close(socketId, function () {
                console.log("Error on bind(): ", result);
              });
            } else {
              chrome.sockets.udp.joinGroup(socketId, "230.0.0.1", function (result) {
                if (result !== 0) {
                  chrome.sockets.udp.close(socketId, function () {
                    console.log("Error on joinGroup(): ", result);
                  });
                } else {
                  chrome.sockets.udp.onReceive.addListener(function(data) {
                    var out = arrayBufferToString(data.data);
                    if (out !== null && out.length > 42) {
                      var b = out.substring(18);
                      var register = b.slice(0,3);
                      var totalword = b.slice(26,31);
                      var totalamount = b.slice(35, 43);
                      var end = b.slice(4,6);
                      if (end == "CS" || end == "ST") {
                         hideBitcoinButton();
                      }
                      
                      if (totalword == "TOTAL") {
                         showBitcoinButton(totalamount);
                         $scope.a++;
                      }
                      
                    }
                    console.log(out);
                  });
                  chrome.sockets.udp.onReceiveError.addListener(function(data) {
                    console.log(data);
                  });
                  
                }
              });
            }
          });
        });
      });
    };
    
    startMulticast();

});

function arrayBufferToString(arrayBuffer) {
  return String.fromCharCode.apply(String, new Uint8Array(arrayBuffer));
}

