/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Comment, Context, Converter, Reflection } from "typedoc";
import * as ts from "typescript";
import { ConverterEvents } from "../lib/converter/converter-events";
import { consoleInfo } from "../lib/utils/index";

export function load(app: Application) {
    // 1. sourceFile 执行，先对 reflection.variant = project 进行解析
    // 2. reflection.variant = declaration 对 Father 进行解析 3. 对 constructor 进行解析 ，此时 comment 已经有值了 4. 对 name 进行解析，也有 comment 了 5. 对 getName 进行解析
    app.converter.on(
        Converter.EVENT_CREATE_DECLARATION,
        (context: Context, reflection: Reflection) => {
            // 1. 先拿到 ast node
            // render 拿的 comment 是从哪里拿的
            const symbol =
                reflection.project.getSymbolFromReflection(reflection);
            // TODO symbol.declarations 多个的情况是什么？
            for (const node of symbol?.declarations || []) {
                const sourceFile = node.getSourceFile().getFullText();
                const leadingComments = ts.getLeadingCommentRanges(
                    sourceFile,
                    node.pos
                )!;
                const ldComments =
                    leadingComments &&
                    sourceFile.substring(
                        leadingComments[0].pos,
                        leadingComments[0].end
                    );
                // 返回给定位置后第一个换行符之前的注释范围
                const trailingComments = ts.getTrailingCommentRanges(
                    sourceFile,
                    node.end
                );

                const tlComments =
                    trailingComments &&
                    sourceFile
                        .substring(
                            trailingComments[0].pos,
                            trailingComments[0].end
                        )
                        .slice(2);

                if (tlComments) {
                    reflection.comment = new Comment([
                        { kind: "text", text: tlComments },
                    ]);
                }
                //
            }
        }
    );
    app.converter.on(
        // 解析 constructor \ 解析 getName function
        ConverterEvents.CREATE_SIGNATURE,
        // @ts-ignore
        (
            context: Context,
            reflection: Reflection,
            node: ts.Node,
            signatureObject: any
        ) => {
            const sourceFile = node.getSourceFile().getFullText();
            const leadingComments = ts.getLeadingCommentRanges(
                sourceFile,
                node.pos
            )!;
            const ldComments =
                leadingComments &&
                sourceFile.substring(
                    leadingComments[0].pos,
                    leadingComments[0].end
                );
            // 返回给定位置后第一个换行符之前的注释范围
            const trailingComments = ts.getTrailingCommentRanges(
                sourceFile,
                node.end
            );

            const tlComments =
                trailingComments &&
                sourceFile
                    .substring(trailingComments[0].pos, trailingComments[0].end)
                    .slice(2);

            if (tlComments) {
                reflection.comment = new Comment([
                    { kind: "text", text: tlComments },
                ]);
            }
        }
    );
    app.converter.on(
        ConverterEvents.CREATE_PARAMETER,
        // @ts-ignore
        (context: Context, reflection: Reflection) => {
            // 1. name ==>  reflection.variant = param && reflection.name = 'name'
            // reflection.parent.comment.summary = [{ kind: "text", text: "这是头行注释",}
            //
            //
            // injectSource(context, reflection, node);
        }
    );

    app.converter.on(
        ConverterEvents.CREATE_TYPE_PARAMETER,
        // @ts-ignore
        (context: Context, reflection: Reflection) => {
            // injectSource(context, reflection, node);
        }
    );
    app.converter.on(
        ConverterEvents.RESOLVE_BEGIN,
        // @ts-ignore
        (...args) => {
            // injectSource(context, reflection, node);
        }
    );

    app.converter.on(
        ConverterEvents.RESOLVE,
        // @ts-ignore
        (...args) => {
            // injectSource(context, reflection, node);
        }
    );

    app.converter.on(
        ConverterEvents.RESOLVE_END,
        // @ts-ignore
        (...args) => {
            // injectSource(context, reflection, node);
        }
    );
}

// function injectSource(context: Context, reflection: Reflection, node: ts.Node) {
//     if (node) {
//         const sourceFile = node.getSourceFile();
//         if (reflection.comment?.tags) {
//             reflection.comment.tags = reflection.comment.tags.map((tag) => {
//                 if (tag.tagName === "source") {
//                     return mapSourceTag(tag, node, sourceFile);
//                 }
//                 return tag;
//             });
//         }
//     }
// }

// function mapSourceTag(
//     tag: CommentTag,
//     node: ts.Node,
//     sourceFile: ts.SourceFile
// ) {
//     const code = printNode(getNode(node), sourceFile);
//     return {
//         tagName: "source",
//         paramName: "",
//         text: `${tag.text}\n\`\`\`typescript\n${stripBlockComments(
//             code
//         )}\n\`\`\`\n\n`,
//     };
// }

// function getNode(node: ts.Node) {
//     if (ts.isVariableDeclaration(node)) {
//         return node.parent;
//     }
//     return node;
// }

// function printNode(node: ts.Node, sourceFile: ts.SourceFile) {
//     const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
//     return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
// }

// function stripBlockComments(code: string) {
//     return code
//         .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/, "$1")
//         .replace(/^\s+|\s+$/g, "");
// }
