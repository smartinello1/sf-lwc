import { LightningElement, api } from "lwc";

export default class Pdfcreator extends LightningElement {
  @api recordId;
  text = "";

  file;

  changeText(evt) {
    this.text = evt.target.value;
    console.log("text: ", this.text);
  }

  createPDF() {
    console.log("pdf creation...");
    //this.text = '%PDF-1.3 \n'+this.text + '\n %EOF';
    let text = "%PDF-1.3 \n" + this.text + "\n %EOF";
    let pdf = new File([text], "test.pdf", { type: "application/pdf" });
    console.log("@@@ pdf ", pdf);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = pdf;
    // the filename you want
    a.download = "test.pdf";
    document.body.appendChild(a);
    //a.click();
  }
}