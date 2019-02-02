const App = {

    audioContext: null,
    source: null,
    analyser: null,

    init() {
        this.binds();
    },

    binds() {
        document.querySelector('#start-tuning').addEventListener('click', function () {

            this.initAudioContext();
        }.bind(this));
    },

    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.minDecibels = -80;
        this.analyser.maxDecibels = -30;
        let bufferLength = this.analyser.frequencyBinCount;
        this.analyser.dataArray = new Uint8Array(bufferLength);
        this.analyser.dataArrayFreq = new Float32Array(bufferLength);
        console.log(bufferLength);


        let mediaSource = navigator.mediaDevices.getUserMedia({audio: true})
            .then(mediaStreamObject => {
                    this.source = this.audioContext.createMediaStreamSource(mediaStreamObject);
                    this.source.connect(this.analyser);
                    this.drawAnalyser(bufferLength);
                    // let drawVisual = requestAnimationFrame(this.drawAnalyser.bind(this, bufferLength));
                    // this.drawAnalyser(bufferLength);
                }
            ).catch(err => {
                console.log(err);
            });


        if (this.audioContext && this.analyser && mediaSource) {
            console.log('inited');
        }
    },

    drawAnalyser(bufferLength) {
        let $analyser = document.querySelector('#analyser');
        if ($analyser) {

            const drawVisual = requestAnimationFrame(this.drawAnalyser.bind(this, bufferLength));
            let h = $analyser.clientHeight,
                w = $analyser.clientWidth,
                analyserContext = $analyser.getContext('2d');
            $analyser.width = w;
            $analyser.height = h;

            this.analyser.getByteFrequencyData(this.analyser.dataArray);
            // this.analyser.getFloatFrequencyData(this.analyser.dataArrayFreq);

            analyserContext.fillStyle = 'rgb(0, 0, 0)';
            analyserContext.fillRect(0, 0, w, h);

            analyserContext.lineWidth = 2;
            analyserContext.strokeStyle = 'rgb(0, 0, 0)';
            analyserContext.beginPath();

            let barWidth = (w / bufferLength) * 2.5,
                barHeight,
                x = 0;

            // console.log(this.analyser.getFloatFrequencyData(this.analyser.dataArrayFreq));
            for (let i = 0; i < bufferLength; i++) {
                barHeight = this.analyser.dataArray[i] / 2;

                analyserContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                analyserContext.fillRect(x, h - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
    }
};


window.App = App;
export default App;