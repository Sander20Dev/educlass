import parse from 'html-react-parser'
import styles from './html-parse.module.css'

export default function HTMLParser({ html }: { html: string }) {
  return <div className={styles['html-parser']}>{parse(html)}</div>
}
