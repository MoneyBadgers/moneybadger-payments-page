#!/bin/bash
open "http://localhost:5173/?merchantCode=ozow&amountCents=100&orderId=$(uuidgen)&timeoutInSeconds=30&requireRefunds=true"