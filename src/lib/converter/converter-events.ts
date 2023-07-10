export const ConverterEvents = {
    BEGIN: "begin",
    END: "end",
    //
    CREATE_DECLARATION: "createDeclaration",
    CREATE_SIGNATURE: "createSignature",
    CREATE_PARAMETER: "createParameter",
    CREATE_TYPE_PARAMETER: "createTypeParameter",
    RESOLVE_BEGIN: "resolveBegin",
    RESOLVE: "resolveReflection",
    RESOLVE_END: "resolveEnd",
} as const;
