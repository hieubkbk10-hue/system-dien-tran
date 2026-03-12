import type {
  DOMConversionMap,
  DOMConversionOutput,
  LexicalNode,
  SerializedTextNode,
} from 'lexical';
import { $isTextNode, TextNode } from 'lexical';

function convertImportedTextNode(node: LexicalNode | null): LexicalNode | null {
  if ($isTextNode(node)) {
    return $createExtendedTextNodeFromTextNode(node);
  }

  return node;
}

function convertImportedChildNode(node: LexicalNode | null | undefined): LexicalNode | null | undefined {
  if ($isTextNode(node)) {
    return $createExtendedTextNodeFromTextNode(node);
  }

  return node;
}

function convertTextDOMOutput(output: DOMConversionOutput | null): DOMConversionOutput | null {
  if (!output) {
    return null;
  }

  const originalForChild = output.forChild;

  return {
    ...output,
    forChild: (lexicalNode, parent) =>
      convertImportedChildNode(
        originalForChild ? originalForChild(lexicalNode, parent) : lexicalNode,
      ),
    node: Array.isArray(output.node)
      ? output.node.map((node) => convertImportedTextNode(node)) as LexicalNode[]
      : convertImportedTextNode(output.node),
  };
}

export class ExtendedTextNode extends TextNode {
  static getType(): string {
    return 'text';
  }

  static clone(node: ExtendedTextNode): ExtendedTextNode {
    return new ExtendedTextNode(node.__text, node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    const importers = TextNode.importDOM();

    if (!importers) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(importers).map(([tag, importer]) => [
        tag,
        (domNode: HTMLElement) => {
          const importerResult = importer(domNode);

          if (!importerResult) {
            return null;
          }

          return {
            ...importerResult,
            conversion: (element: HTMLElement) =>
              convertTextDOMOutput(importerResult.conversion(element)),
          };
        },
      ]),
    ) as DOMConversionMap;
  }

  static importJSON(serializedNode: SerializedTextNode): ExtendedTextNode {
    return $createExtendedTextNodeFromTextNode(TextNode.importJSON(serializedNode));
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: 'text',
      version: 1,
    };
  }
}

export function $createExtendedTextNode(text: string): ExtendedTextNode {
  return new ExtendedTextNode(text);
}

export function $createExtendedTextNodeFromTextNode(textNode: TextNode): ExtendedTextNode {
  const node = new ExtendedTextNode(textNode.getTextContent());
  node.setFormat(textNode.getFormat());
  node.setDetail(textNode.getDetail());
  node.setMode(textNode.getMode());
  node.setStyle(textNode.getStyle());
  return node;
}

export function $isExtendedTextNode(node?: LexicalNode | null): node is ExtendedTextNode {
  return node instanceof ExtendedTextNode;
}
