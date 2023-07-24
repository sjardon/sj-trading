# Actions Module (or hooks or trigger module)

Add more actions or set of actions by condition and a module that know how to handle each action:

```json
{
  "type": "UPDATE_STOP_LOSS_ORDER",
  "condition": {
    "type": "AND",
    "values": ["etc", "etc"]
  },
  "serValue": 0.3,
  "serValue": {
    "type": "ADD",
    "values": [0.1, 0.2]
  }
}
```
