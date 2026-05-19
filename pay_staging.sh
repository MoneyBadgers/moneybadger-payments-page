#!/bin/bash
open "http://pay.staging.cryptoqr.net/?merchantCode=ozow&amountCents=20000000&orderId=$(uuidgen)&timeoutInSeconds=300&requireRefunds=true"
