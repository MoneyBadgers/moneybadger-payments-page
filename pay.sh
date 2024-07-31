#!/bin/bash
open "http://localhost:5173/?merchantCode=test&amountCents=100&orderId=$(uuidgen)"