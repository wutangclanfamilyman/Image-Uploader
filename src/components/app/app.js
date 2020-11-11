import React, { Component, createRef } from 'react'
import {connect} from 'react-redux'
import {Icon} from '@material-ui/core'
import copy from 'copy-to-clipboard'
import {imageLoaded, imageLoading, appLoaded} from '../../actions'
import axios from 'axios'

class App extends Component {

    state = {
        dragging: false
    }

    hiddenFileInput = createRef()
    copyInput = createRef()

    componentDidMount() {
        this.props.appLoaded()
        this.dragCounter = 0
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++ 
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({
                dragging: true
            })
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({dragging: false})
        }
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragging: false
        })
        if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const data = new FormData()
            data.append('file', e.dataTransfer.files[0])

            axios.post('http://localhost:8000/upload', data, {

            }).then(res => {
                this.dragCounter = 0
                this.props.imageLoaded(res.data.path)
            })
            
        }
    }

    handleClick = event => {
        this.hiddenFileInput.current.click();
    }

    handleCopy = () => {
        copy(this.copyInput.current.value)
    }

    handleChange = event => {
        if(!event.target.files[0]) {
            return
        }
        this.props.imageLoading()
        const data = new FormData()
        data.append('file', event.target.files[0])

        axios.post('http://localhost:8000/upload', data, {

        }).then(res => {
            this.props.imageLoaded(res.data.path)
        })
    }

    render() {

        const {loading, fileLoaded, fileLink} = this.props

        if(loading) {
            return (
                <div className="loading">
                    <div className="upload-header">Uploading...</div>
                    <div className="container-loader">
                        <div className="circleloader"></div>
                    </div>
                </div>
            )
        }

        if(fileLoaded && fileLink) {
            return (
                <div className="uploaded-form">
                    <div className="success-icon">
                        <Icon style={{fontSize: 80, color: "#fff"}}>check</Icon>
                    </div>
                    <div className="upload-header">Uploaded Successfully!</div>
                    <div className="success-image">
                        <img src={fileLink} />
                    </div>
                    <div className="container-link">
                        <input className="success-input" value={fileLink} ref={this.copyInput} disabled/>
                        <button className="btn btn-primary" onClick={this.handleCopy}>Copy</button>
                    </div>
                </div>
            )
        }

        return (
            <div className="upload-form">
                <div className="upload-header">Upload your image</div>
                <div className="upload-subheader">File should be JPEG, PNG...</div>
                <div className="drag-and-drop" onDragEnter={this.handleDragIn} onDrop={this.handleDrop} onDragLeave={this.handleDragOut} onDragOver={this.handleDrag}>
                    <div className="drag-and-drop__img">
                        <Icon style={{fontSize: 120, color: "#c4c4c4"}}>cloud_upload</Icon>
                    </div>
                    <div className="drag-and-drop__title">
                        Drag & Drop your image here
                    </div>
                    {this.state.dragging ? <DragInFile /> : ''}
                </div>
                <div className="upload-or">Or</div>
                <input type="file" ref={this.hiddenFileInput} onChange={this.handleChange} accept="image/x-png,image/gif,image/jpeg,image/svg" style={{display: 'none'}} />
                <button onClick={this.handleClick} className="btn btn-primary">Choose a file</button>
            </div>
        )
    }
}

const DragInFile = () => {
    return (
        <div className="drag-and-drop__in">
            Drop Here
        </div>
    )
}

const mapStateToProps = ({loading, fileLink, fileLoaded}) => {
    return {
        loading,
        fileLink,
        fileLoaded
    }
}

const mapDispatchToProps = {
    imageLoaded,
    imageLoading,
    appLoaded
}

export default connect(mapStateToProps, mapDispatchToProps)(App)