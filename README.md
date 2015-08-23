# Bitcoin Payment Terminal for Verifone Topaz Sapphire Point of Sale

This is a Google Chrome packaged application that runs in Kiosk mode and allow customers to pay with bitcoins. It sits beside my credit card terminal and allow for my convenience store/gas station to take bitcoin payments.

## About us

Cosmic market is a gas station location at 2730 23rd Ave, Greeley, CO  80634. We started accepting bitcoins on December 31, 2013. At the time we were the only gas station anywhere that accepted bitcoin. 

## Why I wrote this and how it works.

When we first started accepting bitcoin it was on a web based app that I wrote in a single night that would allow the cashier to enter the amount to collect and then show the customer bitcoin qr code for payment. This application used the Coinbase php api to interact and collect payment.

Two weeks later Coinbase Merchent app for Android came out and so I loaded that up and used that for almost 1.5 years. Then one day that stoped worked and Coinbase took it off the Google Play store. 

Ever since I first started accepting bitcoins I have wanted a way wherw the terminal app could be connected to my point of sale system. So being a programmer I figured out that the point of sale was able to broadcast receipt information on the network. This is designed to be used as a way to send this information to a dvr so that it can be overlaped on to cctv footage. 


### Example for what is being broadcasted over the network

```
08/18/15 22:12:02 101 %%          Bic Lighter   1        1.79 
08/18/15 22:12:07 101                       TOTAL        7.83 
08/18/15 22:12:21 101                       DEBIT        7.83 
08/18/15 22:12:21 101 ST#  F0001 TILL XXXX DR# 1 TRAN# 1015206
08/18/15 22:12:21 101 CSH: HARIS             08/18/15 22:12:21
08/18/15 22:12:37 101             UNLD CA #03   7       -0.16 
08/18/15 22:12:38 101                       TOTAL       -0.16 
08/18/15 22:12:39 101                        CASH       -0.16 
08/18/15 22:12:39 101 ST#  F0001 TILL XXXX DR# 1 TRAN# 1015207
08/18/15 22:12:39 101 CSH: HARIS             08/18/15 22:12:39
08/18/15 22:13:12 101 ID CHECK SKIPPED
08/18/15 22:13:12 101 %%           OIL BURNER   1        2.99 
08/18/15 22:13:15 101 %%           OIL BURNER   1        2.99 
08/18/15 22:13:22 101 %% LIGHTER BIC CHILD GU   1        1.49 
08/18/15 22:13:27 101                       TOTAL        6.90 
08/18/15 22:13:27 101                        CASH       20.00 
08/18/15 22:13:27 101 ST#  F0001 TILL XXXX DR# 1 TRAN# 1015208
08/18/15 22:13:27 101 CSH: HARIS             08/18/15 22:13:27
08/18/15 22:14:46 101 %%           COKE 16 OZ   1        1.19 
08/18/15 22:15:10 101 %%           COKE 16 OZ   1        1.19 
08/18/15 22:15:28 101 ID CHECK SKIPPED
08/18/15 22:15:28 101 %%           OIL BURNER   1        2.99 
08/18/15 22:15:29 101 %%           OIL BURNER   1        2.99 
08/18/15 22:15:35 101                       TOTAL        7.44 
08/18/15 22:15:42 101                      CREDIT        7.44 
08/18/15 22:15:42 101 ST#  F0001 TILL XXXX DR# 1 TRAN# 1015209
08/18/15 22:15:42 101 CSH: HARIS             08/18/15 22:15:42
```

The cash register broadcasts over udp on "230.0.0.1" port 14001. This is just plain ascii text each line has the date time then the cash register number and the rest is what you would see on a paper receipt. 

## Picture are worth a 1000 words.



