#!/bin/bash
git push origin "$(git rev-parse --abbrev-ref HEAD)":staging --force-with-lease
