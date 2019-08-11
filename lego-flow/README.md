![](https://i.postimg.cc/bNGkLHHY/image.png)

# lego-flow

```json
{
  "name": "服务任务",
  "code": "serviceTask",
  "type": "task",
  "inServiceFlow": 1,
  "inWorkFlow": 1,
  "icon": "https://img.alicdn.com/tfs/TB1BOANaMHqK1RjSZFPXXcwapXa-200-200.svg",
  "attrOptions": {
    "attrSchema": {
      // 节点配置信息描述
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "title": "节点ID"
        },
        "name": {
          "type": "string",
          "title": "节点名称"
        },
        "executeMode": {
          "type": "string",
          "title": "执行模式",
          "x-enum": "/api/enum/getExecuteModes?nodeCode=serviceTask"
        },
        "executeExtService": {
          "type": "object",
          "title": "执行阶段服务",
          "properties": {
            "executeType": {
              "type": "string",
              "title": "服务类型",
              "x-enum": "/api/service/typeList"
            },
            "executeDetail": {
              "type": "object",
              "x-watched": ["executeType"]
            }
          }
        }
      }
    }
  },
  "uiOptions": {
    // 节点UI信息描述
    "shape": "vRectangle",
    "icon": "https://img.alicdn.com/tfs/TB1OcJfwyMnBKNjSZFCXXX0KFXa-13-13.svg",
    "geometry": {
      "width": 144,
      "height": 30
    },
    "canIncludeChild": 1 // 是否能够包含子节点
  }
}
```

# Motivation & Credits

- [floweditor](https://github.com/nyaruka/floweditor)
