#!/bin/bash
open "http://localhost:5173/?merchantCode=testMerchant&amountCents=100&orderId=$(uuidgen)&timeoutInSeconds=300&requireRefunds=true"
