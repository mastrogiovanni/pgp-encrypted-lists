export const identitySchema = {
    type: "object",
    properties: {
        doc: {
            type: "object",
            properties: {
                id: { type: "string" },
                authentication: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            controller: { type: "string" },
                            type: { type: "string" },
                            publicKeyBase58: { type: "string" },
                        },
                        required: [
                            "id",
                            "controller",
                            "type",
                            "publicKeyBase58",
                        ],
                        additionalProperties: false,
                    }
                },
                created: { type: "string" },
                updated: { type: "string" },
                proof: {
                    type: "object",
                    properties: {
                        type: { type: "string" },
                        verificationMethod: { type: "string" },
                        signatureValue: { type: "string" },
                    },
                    required: [
                        "type",
                        "verificationMethod",
                        "signatureValue",
                    ],
                    additionalProperties: false,
                },
            },
            required: ["id", "authentication", "created", "updated", "proof"],
            additionalProperties: false,
        },
        key: {
            type: "object",
            properties: {
                type: { type: "string" },
                public: { type: "string" },
                secret: { type: "string" },
                encoding: { type: "string" },
            },
            required: ["type", "public", "secret", "encoding"],
            additionalProperties: false,
        },
    },
    required: ["doc", "key"],
    additionalProperties: false,
};
