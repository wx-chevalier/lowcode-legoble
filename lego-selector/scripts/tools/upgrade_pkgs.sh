#!/bin/bash
set -ex

ncu -u
 
(cd ./packages/lego-selector && ncu -u)
(cd ./packages/lego-selector-react && ncu -u)

