#!/bin/bash
set -ex

ncu
 
(cd ./packages/lego-form-core && ncu)
(cd ./packages/lego-form-antd && ncu)
(cd ./packages/lego-form-builder && ncu)

