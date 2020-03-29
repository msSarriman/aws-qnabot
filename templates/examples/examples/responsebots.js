var _ = require('lodash');

var config={
    "voiceId":"Joanna",
    "Clarification":"Sorry, can you please repeat that?",
    "Abort":"Sorry, I could not understand. Please start again.",
    "utterances":require('../../../assets/default-utterances')
};

exports.resources={
    // Yes_No ResponseBot
    "YesNoSlotType":{
        "Type": "Custom::LexSlotType",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAYesNoSlotType-${AWS::StackName}"},
            "enumerationValues": [
                {"value":"Yes", "synonyms":["OK","Yeah","Sure","Yep","Affirmative","Si","Oui"]},
                {"value":"No", "synonyms":["Nope","Na","Negative","Non"]},
              ]
        }
    },
    "YesNoIntent": {
      "Type": "Custom::LexIntent",
      "Properties": {
        "ServiceToken": {"Ref": "CFNLambda"},
        "name":{"Fn::Sub":"QNAYesNoIntent-${AWS::StackName}"},
        "sampleUtterances": [
            "{Yes_No}",
            "I said {Yes_No}"
        ],
        conclusionStatement: {
          messages: [
            {
              content: "OK. ", 
              contentType: "PlainText"
            }
          ], 
        },
        description: "Parse Yes or No responses.", 
        fulfillmentActivity: {
          type: "ReturnIntent"
        },
        "slots": [
          {
            "name":"Yes_No",
            "slotType":{"Ref":"YesNoSlotType"},
            "slotTypeVersion":"$LATEST",
            "slotConstraint": "Required",
            "valueElicitationPrompt": {
              "messages": [
                {
                  "contentType": "PlainText",
                  "content": "Say Yes or No."
                }
              ],
              "maxAttempts": 2
            },
            "priority": 1,
          }
        ],
      },
    },
    "QNAYesNo": {
      "Type": "Custom::LexBot",
      "Properties": {
        "ServiceToken": {"Ref": "CFNLambda"},
        "name":{"Fn::Sub":"QNAYesNoBot-${AWS::StackName}"},
        "locale": "en-US",
        "voiceId": config.voiceId,
        "childDirected": false,
        "intents": [
            {"intentName": {"Ref": "YesNoIntent"},"intentVersion": "$LATEST"},
        ],
        "clarificationPrompt": {
          "messages": [
            {
              "contentType": "PlainText",
              "content": config.Clarification
            }
          ],
          "maxAttempts": 5
        },
        "abortStatement": {
          "messages": [
            {
              "content": config.Abort,
              "contentType": "PlainText"
            }
          ]
        }
      }
    },
    "YesNoAlias": {
      "Type": "Custom::LexAlias",
      "DependsOn": "QNAYesNo",
      "Properties": {
        "ServiceToken": {"Ref": "CFNLambda"},
        "botName": {
          "Ref": "QNAYesNo"
        },
        "botVersion": "$LATEST"
      }
    },
    "DateIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNADateIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The date is {date}",
                "The date was {date}",
                "I went on {date}",
                "It is {date}",
                "It occurred on {date}",
                "My birthdate is {date}",
                "{date}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {date} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the date again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse date responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"date",
                    "slotType": "AMAZON.DATE",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What date?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNADate": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNADateBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "DateIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "DateAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNADate",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNADate"
            },
            "botVersion": "$LATEST"
        }
    },
    "DayOfWeekIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNADayOfWeekIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The day is {DayOfWeek}",
                "The day was {DayOfWeek}",
                "I went on {DayOfWeek}",
                "It is {DayOfWeek}",
                "It occurred on {DayOfWeek}",
                "{DayOfWeek}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {DayOfWeek} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the day again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse day responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"DayOfWeek",
                    "slotType": "AMAZON.DayOfWeek",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What day?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNADayOfWeek": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNADayOfWeekBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "DayOfWeekIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "DayOfWeekAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNADayOfWeek",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNADayOfWeek"
            },
            "botVersion": "$LATEST"
        }
    },
    "MonthIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAMonthIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The month is {Month}",
                "The month was {Month}",
                "It is {Month}",
                "It occurred on {Month}",
                "{Month}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {Month} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the month again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse day responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"Month",
                    "slotType": "AMAZON.Month",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What month?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNAMonth": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAMonthBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "MonthIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "MonthAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNAMonth",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNAMonth"
            },
            "botVersion": "$LATEST"
        }
    },
    "NumberIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNANumberIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The number is {Number}",
                "The number was {Number}",
                "It is {Number}",
                "{Number}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {Number} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the number again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse number responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"Number",
                    "slotType": "AMAZON.NUMBER",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What number?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNANumber": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNANumberBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "NumberIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "NumberAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNANumber",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNANumber"
            },
            "botVersion": "$LATEST"
        }
    },
    "PhoneNumberIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAPhoneNumberIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The phone number is {PhoneNumber}",
                "My phone number is {PhoneNumber}",
                "It is {PhoneNumber}",
                "{PhoneNumber}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {PhoneNumber} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the phone number again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse phone number responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"PhoneNumber",
                    "slotType": "AMAZON.PhoneNumber",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What phone number?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNAPhoneNumber": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAPhoneNumberBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "PhoneNumberIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "PhoneNumberAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNAPhoneNumber",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNAPhoneNumber"
            },
            "botVersion": "$LATEST"
        }
    },
    "TimeIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNATimeIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "The time was {Time}",
                "It occurred at {Time}",
                "At {Time}",
                "{Time}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {Time} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the time again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse time responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"Time",
                    "slotType": "AMAZON.TIME",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What time?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNATime": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNATimeBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "TimeIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "TimeAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNATime",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNATime"
            },
            "botVersion": "$LATEST"
        }
    },
    "EmailAddressIntent": {
        "Type": "Custom::LexIntent",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAEmailAddressIntent-${AWS::StackName}"},
            "sampleUtterances": [
                "My email address is {EmailAddress}",
                "The email address is {EmailAddress}",
                "{EmailAddress}"
            ],
            conclusionStatement: {
                messages: [
                    {
                        content: "OK. ",
                        contentType: "PlainText"
                    }
                ],
            },
            confirmationPrompt: {
                maxAttempts: 1,
                messages: [
                    {
                        content: "Is {EmailAddress} correct (Yes/No)?",
                        contentType: "PlainText"
                    }
                ]
            },
            rejectionStatement: {
                messages: [
                    {
                        content: "Please let me know the email address again?",
                        contentType: "PlainText"
                    }
                ]
            },
            description: "Parse email address responses.",
            fulfillmentActivity: {
                type: "ReturnIntent"
            },
            "slots": [
                {
                    "name":"EmailAddress",
                    "slotType": "AMAZON.EmailAddress",
                    "slotConstraint": "Required",
                    "valueElicitationPrompt": {
                        "messages": [
                            {
                                "contentType": "PlainText",
                                "content": "What email address?"
                            }
                        ],
                        "maxAttempts": 2
                    },
                    "priority": 1,
                }
            ],
        },
    },
    "QNAEmailAddress": {
        "Type": "Custom::LexBot",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "name":{"Fn::Sub":"QNAEmailAddressBot-${AWS::StackName}"},
            "locale": "en-US",
            "voiceId": config.voiceId,
            "childDirected": false,
            "intents": [
                {"intentName": {"Ref": "EmailAddressIntent"},"intentVersion": "$LATEST"},
            ],
            "clarificationPrompt": {
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": config.Clarification
                    }
                ],
                "maxAttempts": 3
            },
            "abortStatement": {
                "messages": [
                    {
                        "content": config.Abort,
                        "contentType": "PlainText"
                    }
                ]
            }
        }
    },
    "EmailAddressAlias": {
        "Type": "Custom::LexAlias",
        "DependsOn": "QNAEmailAddress",
        "Properties": {
            "ServiceToken": {"Ref": "CFNLambda"},
            "botName": {
                "Ref": "QNAEmailAddress"
            },
            "botVersion": "$LATEST"
        }
    }
};


exports.names=[
  "QNAYesNo", "QNADate", "QNADayOfWeek", "QNAMonth", "QNANumber", "QNAPhoneNumber", "QNATime", "QNAEmailAddress"
] ;


exports.outputs=_.fromPairs(exports.names.map(x=>{
        return [x,{Value:{"Ref": x}}];
    }));
