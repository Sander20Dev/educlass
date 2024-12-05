'use client'

import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBlockquote,
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconItalic,
  IconList,
  IconListNumbers,
  IconUnderline,
} from '@tabler/icons-react'
import clsx from 'clsx'
import { JSX, useCallback, useMemo, useState } from 'react'
import {
  createEditor,
  BaseEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  Text,
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
} from 'slate-react'
import { jsx } from 'slate-hyperscript'
import escapeHtml from 'escape-html'
import styles from './html-parse.module.css'

type CustomElement = {
  type:
    | 'paragraph'
    | 'block-quote'
    | 'heading-one'
    | 'heading-two'
    | 'list-item'
    | 'numbered-list'
    | 'bulleted-list'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CustomText[]
}
type CustomText = {
  text: string
  bold?: boolean
  code?: boolean
  italic?: boolean
  underline?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const hotkeys = [
  { ctrlKey: true, key: 'b', mark: 'bold' },
  { ctrlKey: true, key: 'i', mark: 'italic' },
  { ctrlKey: true, key: 'u', mark: 'underline' },
  { ctrlKey: true, key: '`', mark: 'code' },
]

export default function TextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const initialValue = useMemo(() => {
    const html = value
    const document = new DOMParser().parseFromString(html, 'text/html')
    return deserialize(document.body)
  }, [value])

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate
      editor={editor}
      initialValue={initialValue as Descendant[]}
      onChange={(val) => onChange(val.map(serialize).join(''))}>
      <div className='border border-slate-200 rounded-lg'>
        <div className='w-full flex flex-row flex-wrap gap-2 bg-gray-50 border-b border-slate-200 p-2'>
          <MarkButton format='bold' icon={<IconBold size={16} />} />
          <MarkButton format='italic' icon={<IconItalic size={16} />} />
          <MarkButton format='underline' icon={<IconUnderline size={16} />} />
          <MarkButton format='code' icon={<IconCode size={16} />} />
          <BlockButton format='heading-one' icon={<IconH1 size={16} />} />
          <BlockButton format='heading-two' icon={<IconH2 size={16} />} />
          <BlockButton
            format='block-quote'
            icon={<IconBlockquote size={16} />}
          />
          <BlockButton
            format='numbered-list'
            icon={<IconListNumbers size={16} />}
          />
          <BlockButton format='bulleted-list' icon={<IconList size={16} />} />
          <BlockButton format='left' icon={<IconAlignLeft size={16} />} />
          <BlockButton format='center' icon={<IconAlignCenter size={16} />} />
          <BlockButton format='right' icon={<IconAlignRight size={16} />} />
          <BlockButton
            format='justify'
            icon={<IconAlignJustified size={16} />}
          />
        </div>
        <div className='p-2'>
          <Editable
            className={'focus:outline-none ' + styles['html-parser']}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder='Escribe aquí...'
            onKeyDown={(event) => {
              for (const hotkey of hotkeys) {
                if (
                  event.ctrlKey === hotkey.ctrlKey &&
                  event.key.toLowerCase() === hotkey.key
                ) {
                  event.preventDefault()
                  const mark = hotkey.mark
                  toggleMark(editor, mark)
                }
              }
            }}
          />
        </div>
      </div>
    </Slate>
  )
}

const serialize = (node: Descendant): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children.map((n) => serialize(n)).join('')

  switch (node.type) {
    case 'heading-one':
      return `<h1>${children}</h1>`
    case 'heading-two':
      return `<h2>${children}</h2>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'numbered-list':
      return `<ol><li>${children}</li></ol>`
    case 'bulleted-list':
      return `<ul><li>${children}</li></ul>`
    case 'block-quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    // case 'link':
    //   return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return children
  }
}

const deserialize = (
  el: HTMLElement,
  markAttributes: Record<string, boolean> = {}
):
  | CustomElement
  | CustomText
  | Descendant
  | Descendant[]
  | string
  | null
  | (string | Descendant | null)[] => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent)
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes = { ...markAttributes }

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes.bold = true
  }

  const children = Array.from(el.childNodes)
    .map((node) => deserialize(node as HTMLElement, nodeAttributes))
    .flat()

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children)
    case 'P':
      return jsx('element', { type: 'paragraph' }, children)
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    case 'H1':
      return jsx('element', { type: 'heading-one' }, children)
    case 'H2':
      return jsx('element', { type: 'heading-two' }, children)
    case 'UL':
      return jsx('element', { type: 'bulleted-list' }, children)
    case 'OL':
      return jsx('element', { type: 'numbered-list' }, children)
    case 'LI':
      return jsx('element', { type: 'list-item' }, children)
    default:
      return children
  }
}

const toggleMark = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive =
    (Editor.marks(editor) as Record<string, boolean> | null)?.[format] === true

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = { textAlign: element.align as 'left' }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const isBlockActive = (
  editor: BaseEditor & ReactEditor,
  format: string,
  blockType = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof CustomElement] === format,
    })
  )

  return !!match
}
const toggleBlock = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as 'left'),
    }
  } else {
    newProperties = {
      type: isActive
        ? 'paragraph'
        : isList
        ? 'list-item'
        : (format as 'paragraph'),
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block as CustomElement)
  }
}

const BlockButton = ({
  format,
  icon,
}: {
  format: string
  icon: JSX.Element
}) => {
  const editor = useSlate()

  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )

  return (
    <Button
      active={isActive}
      onMouseDown={(ev) => {
        ev.preventDefault()
        toggleBlock(editor, format)
      }}>
      {icon}
    </Button>
  )
}
const MarkButton = ({
  format,
  icon,
}: {
  format: string
  icon: JSX.Element
}) => {
  const editor = useSlate()

  const isActive =
    (Editor.marks(editor) as Record<string, boolean> | null)?.[format] === true

  return (
    <Button
      active={isActive}
      onMouseDown={(ev) => {
        ev.preventDefault()
        toggleMark(editor, format)
      }}>
      {icon}
    </Button>
  )
}

const Button = ({
  active,
  onMouseDown,
  children,
}: {
  active: boolean
  onMouseDown: (ev: React.MouseEvent<HTMLButtonElement>) => void
  children: JSX.Element
}) => {
  return (
    <button
      className={clsx(
        'focus:outline-none p-1 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-200 transition rounded-lg',
        active
          ? 'text-slate-900 hover:text-slate-600 bg-slate-200 hover:bg-slate-100'
          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
      )}
      onMouseDown={onMouseDown}>
      {children}
    </button>
  )
}
