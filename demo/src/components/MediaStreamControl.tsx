import * as React from 'react';
import { ConferenceStream, ChromeExtension } from 'react-conf-webrtc';

interface IMediaStreamControlProps {
    audioEnabled: boolean;
    videoEnabled: boolean;
    toggleAudioEnabled: (stream?: ConferenceStream) => void;
    toggleVideoEnabled: (stream?: ConferenceStream) => void;
    toggleScreenShare?: () => void;
}

export class MediaStreamControl extends React.Component<IMediaStreamControlProps, {}> {

    constructor() {
        super()
        this.onToggleAudioEnabled = this.onToggleAudioEnabled.bind(this);
        this.onToggleVideoEnabled = this.onToggleVideoEnabled.bind(this);
        this.onToggleScreenShare = this.onToggleScreenShare.bind(this);
    }

    private onToggleAudioEnabled() {
        this.props.toggleAudioEnabled();
    }

    private onToggleVideoEnabled() {
        this.props.toggleVideoEnabled();
    }

    private onToggleScreenShare() {
        ChromeExtension.Instance.isExtensionAvailable()
            .then(available => {
                if (available) {
                    if (this.props.toggleScreenShare) {
                        this.props.toggleScreenShare();
                    }
                }
                else {
                    this.downloadFile('https://github.com/teamious/react-conf-webrtc/raw/master/docs/ext/teamious.screen.chrome.crx');
                }
            })
    }

    private downloadFile(url: string) {
        // Construct the a element
        var link = document.createElement("a");
        link.target = "_blank";

        // Construct the uri
        link.href = url;
        document.body.appendChild(link);
        link.click();

        // Cleanup the DOM
        document.body.removeChild(link);
    }

    render() {
        const muteText = this.props.audioEnabled ? 'Mute Audio' : 'Unmute Audio';
        const disableText = this.props.videoEnabled ? 'Disable Video' : 'Enable Video';
        const shareText = this.props.videoEnabled ? 'Share Screen' : 'Stop';
        return (
            <div className='rcw-stream-controls'>
                <button className='rcw-stream-control-mute' onClick={this.onToggleAudioEnabled}>{muteText}</button>

                <button className='rcw-stream-control-disable' onClick={this.onToggleVideoEnabled}>{disableText}</button>

                {
                    this.props.toggleScreenShare && ChromeExtension.Instance.isChrome() &&
                    <button className='rcw-stream-control-share' onClick={this.onToggleScreenShare}>{shareText}</button>
                }
            </div>
        )
    }
}
