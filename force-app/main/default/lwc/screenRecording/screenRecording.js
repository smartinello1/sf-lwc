import { LightningElement, api } from 'lwc';

export default class ScreenRecording extends LightningElement {
  @api recordId;
  @api objectName;
  recordingDisabled = false;
  downloadDisabled = true;
  chunks = [];
  videoSource;
  url;

  handleStartRecording(event) {
    this.rec();
  }

  handleDownload(event) {
    const downloadContainer = this.template.querySelector(
      '.download-container'
    );
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = this.videoSource;
    a.target = '_parent';
    // the filename you want
    a.download = 'todo-1.webm';
    if (downloadContainer) {
      downloadContainer.appendChild(a);
    }
    a.click();
  }

  async rec() {
    try {
      // Creo uno stream di cattura schermo
      const videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      // Creo uno stream di cattura audio dal microfono di default
      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });
      // Creo un unico stream contenente audio e video
      let allStream = new MediaStream([
        videoStream.getVideoTracks()[0],
        audioStream.getAudioTracks()[0]
      ]);
      // Codifico il tipo di file da registrare
      const mime = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';
      // Creo il registratore dello stream
      let mediaRecorder = new MediaRecorder(allStream, {
        mimeType: mime
      });
      // Quando viene chiuso lo stream video, chiudo anche il registratore dello stream
      // Workaround in quanto il metodo onstop viene richiamato solo quando tutti gli stream vengono chiusi
      allStream.getTracks().forEach((track) =>
        track.addEventListener('ended', () => {
          mediaRecorder.stop();
        })
      );
      //Disabilito i pulsanti di download e registrazione
      this.recordingDisabled = true;
      this.downloadDisabled = true;
      // Passo lo stream al tag video per trasmettere in rt
      this.template.querySelector('.vvv').srcObject = allStream;
      // Non appena ricevo dati li vado a salvare in una variabile
      mediaRecorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };
      // Alla chiusura della registrazione dello stream, mostro l'anteprima e vado a salvare in locale la traccia audio e video
      mediaRecorder.onstop = (e) => {
        try {
          let blob = new Blob(this.chunks, {
            type: 'application/octet-stream' // File binario generico
          });
          let url = URL.createObjectURL(blob);
          this.videoSource = url;
          this.downloadDisabled = false;
          this.recordingDisabled = false;
        } catch (ee) {
          console.log('@@@ e ', ee);
        }
      };
      // Avvio la registrazione
      mediaRecorder.start();
    } catch (e) {
      console.log('@@@ error ', e.message);
    }
  }
}