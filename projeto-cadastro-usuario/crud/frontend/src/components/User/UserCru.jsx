import React, { Component, useState } from 'react'
import axios from 'axios'
import Main from '../templates/Main'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: incluir, listar, alterar e excluir'
}

const baseUrl = 'http://localhost:3001/users'

const initialState = {
    user: { name: '', email: '' },
    list: []
}

export default class UserCrud extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({list: resp.data})
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdateList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdateList(user) {
    
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user) //coloca o usuário na primeira posição
        return list

    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })

    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name='name' value={this.state.user.name}
                                onChange={e => this.updateField(e)} 
                                placeholder='Digite seu nome...'/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name='email' value={this.state.user.email}
                                onChange={e => this.updateField(e)} 
                                placeholder='Digite seu e-mail .....'/>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={e => this.save(e)}>
                                salvar
                            </button>
                            <button className="btn btn-secondary ml-12" onClick={e => this.clear(e)}>
                                Cancelar
                            </button>
                    </div>
                </div>

            </div>

        )

    }

    load(user){
        this.setState({user})
    }

    remove(user){
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.state.list.filter( u => u !== user)
            this.setState({list})
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={e => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                            </button>
                        <button className="btn btn-danger ml-2" onClick={e => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                            </button>
                    </td>
                </tr>
            )
        })
    }

    render() {

        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}