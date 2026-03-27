#!/bin/bash
echo "http://localhost:5173/?merchantCode=ozow&amountCents=100&orderId=$(uuidgen)&timeoutInSeconds=90&requireRefunds=true"
