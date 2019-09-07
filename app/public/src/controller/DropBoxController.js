class DropBoxController {
    constructor(){
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.nameFileEl = this.snackModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');

        this.initEvents();
    }

    /**
     * Inicias os eventos principais da tela
     */
    initEvents(){
        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {
            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = '';
        });
    }

    modalShow(show = true){
        this.snackModalEl.style.display = show ? 'block' : 'none';
    }

    /**
     * Faz o upload de um ou mais arquivos
     * @param files
     * @returns {Promise<any[]>}
     */
    uploadTask(files){
        let promisses = [];

        /*
        Percorre o array e dispara cada um dos resolves das promisses
         */
        [...files].forEach( file => {
           promisses.push(new Promise((resolve,reject) => {
               let ajax = new XMLHttpRequest();

               ajax.open('POST','/upload');

               ajax.onload = event => {

                   this.modalShow(false);

                   try{
                       let request = JSON.parse(ajax.responseText);
                       resolve(request);
                   }catch (e) {
                       reject(e);
                   }
               };

               ajax.onerror = event => {
                   this.modalShow(false);
                   reject(event);
               };

               ajax.upload.onprogress = event => {
                   this.uploadProgress(event, file);
               };

               let formData = new FormData();

               formData.append('input-file', file);

               this.startUploadTime = Date.now();

               ajax.send(formData);
           }))
        });

        return Promise.all(promisses);
    }

    /**
     * Preenche a barra de progresso conforme o upload do arquivo
     * @param event
     * @param file
     */
    uploadProgress(event, file){
        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded/total)*100);
        let timeLeft = (100- porcent) * timeSpent / porcent;

        this.progressBarEl.style.width = `${porcent}%`;

        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft)
    }

    /**
     *Calcula o tempo restante para a conclusao do upload
     * @param duration
     * @returns {string}
     */
    formatTimeToHuman(duration){
        let sec = parseInt((duration / 1000) % 60);
        let min = parseInt((duration / (1000 * 60)) % 60);
        let hour = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hour > 0){
            return `${hour} horas, ${min} minutos e ${sec} segundos`
        }
        if(min > 0){
            return `${hour} horas, ${min} minutos e ${sec} segundos`
        }
        if(sec > 0){
            return `${hour} horas, ${min} minutos e ${sec} segundos`
        }

        return '';
    }
}
