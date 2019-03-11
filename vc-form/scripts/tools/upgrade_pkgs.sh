#!/bin/bash
set -ex

ncu
 
(cd ./packages/vc-form-core && ncu)
(cd ./packages/vc-form-bootstrap && ncu)
(cd ./packages/vc-form-host-app && ncu)
(cd ./packages/vc-form-mobx-app && ncu)
