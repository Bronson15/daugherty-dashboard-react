import React, { Component } from 'react'
import image from '../../logo.png'
import '../../styles/Admin/index.css'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {pullData} from '../../services/pullData'
import {convertToHTML, convertFromHTML} from 'draft-convert'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'

const options = [
    {value: 'atl-lobby', label:'Lobby'},
    {value: 'atl-kitchen', label:'Kitchen'},
    {value: 'atl-dev', label:'Dev Center'}
]
export default class Kitchen extends Component {
    upcomingEng = ''
    constructor(props) {
        super(props)

        this.state = {
            tvIdentifier: '',
            url: '',
            footer: '',
            column: '',
            editorState: EditorState.createEmpty(),
            selectedOption: null
        }
    } 
    
    componentDidMount() {
        this.fillFields()
    }

    handleChange(e) {
        if (e.target.id === 'url') {
            this.setState({url: e.target.value })
        }

        if (e.target.id === 'footer') {
            this.setState({footer: e.target.value})
        }
    }

    dropdownChange = (selectedOption) => {
        this.setState({selectedOption})
        this.setState({tvIdentifier: selectedOption.value}, this.fillFields)
    }

    updateData = () => {
        axios.post('https://daugherty-dashboard-backend.herokuapp.com/api/v1/admin/updateConfig/', {tvIdentifier: (this.state.tvIdentifier), videoPlaylist: (this.state.url), banner: (this.state.footer), sidebar: (this.state.column)})
    }

    fillFields = () => {
        let getData = pullData(fetch)

        return getData({tvIdentifier: this.state.tvIdentifier}).then (result => {
            result.json().then( response => {
                this.setState({
                    url: response.videoPlaylist,
                    footer: response.banner,
                    column: response.sidebar,
                    editorState: EditorState.createWithContent(convertFromHTML(response.sidebar))
                })
            })
            
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
          column: convertToHTML(this.state.editorState.getCurrentContent())
        })
      }

    render() {
        const {selectedOption} = this.state
        return (
            <div className="adminDiv">
                <div className="dbsLogo">
                    <img className="logo" src={image} alt='Daugherty Business Solutions'></img>
                </div>
                
                <div className='form'>
                    <div className='tvSel'>
                        <br/>
                        <Select id='dropdown' 
                                value={selectedOption}
                                onChange={this.dropdownChange}
                                options={options}
                                placeholder='Select a TV'
                                isSearchable={false}
                        />
                    </div>
                    <form onSubmit={this.updateData}>
                        <br/>
                        <label>Video Playlist URL: </label>
                        <input className='textInput' size='200' id='url' value={this.state.url} onChange={this.handleChange.bind(this)}></input>
                        <br/>                    
                        <label>Column Data:</label>
                        <Editor
                            editorState={this.state.editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={this.onEditorStateChange}
                        />
                        <br/>
                        <br/> 
                        <label>Footer Data:</label>
                        <input className='textInput' size="250" id='footer' value={this.state.footer} onChange={this.handleChange.bind(this)}></input>
                    </form>
                    <br/>
                    <div className='btnSubmit'>
                        <Button className='submitBtn' onClick={this.updateData} >Update Dashboard</Button>
                    </div>
                    <br/>
                    <br/>
                </div>
          </div>
        )
    }
}