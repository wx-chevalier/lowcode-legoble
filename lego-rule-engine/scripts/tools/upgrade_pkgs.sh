#!/bin/bash
set -ex

ncu -u
 
(cd ./packages/lego-rule-engine && ncu -u)
(cd ./packages/lego-rule-engine-react && ncu -u)

