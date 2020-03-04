import { saveAs } from 'file-saver';

export default function saveTextAs(text, filename) {

  const blob = new Blob(
    [text],
    {type: "text/plain;charset=utf-8"}
  ) ;

  saveAs(blob, filename);

}
