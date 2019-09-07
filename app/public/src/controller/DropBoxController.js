class DropBoxController {
    constructor(){
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.initEvents();
    }

    initEvents(){
        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {
            this.uploadTask(event.target.files);

            this.snackModalEl.style.display = 'block';
        });
    }

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
                   try{
                       let request = JSON.parse(event);
                       resolve(request);
                   }catch (e) {
                       reject(e);
                   }
               }

               ajax.onerror = event => {
                   reject(event);
               }

               let formData = new FormData();

               formData.append('input-file', file);

               ajax.send(formData);
           }))
        });

        return Promise.all(promisses);
    }
}
