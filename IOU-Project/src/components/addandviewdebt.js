import React from "react";
import "../Style.css";
import axios from 'axios';
import Cookie from "js-cookie";
const qs = require('querystring');

export default class AddViewDebt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // the property of the state that correspond to the field of the database
            description: '',
            quantity: '',
            offererEmail: '',
            reward: '',
            rewardData: [], // this will be shown in a dropdown all the rewards in the database
            debtData: [],
            userIdData: []
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangeSelectReward = this.handleChangeSelectReward.bind(this);
        this.handleChangeSelectOffererEmail = this.handleChangeSelectOffererEmail.bind(this);
        this.deleteDebt = this.deleteDebt.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    componentDidMount() {
        axios({
            method: 'GET',
            url: '/api/rewards',
            data: null
        }).then(res => {
            console.log(res);
            this.setState({
                rewardData: res.data,
                reward: res.data[0].rewardName
            });
        }).catch(err => {
            console.log(err);
        })

        axios({
            method: 'GET',
            url: '/api/user-email',
            data: null
        }).then(res => {
            console.log(res);
            this.setState({
                userIdData: res.data,
                offererEmail: res.data[0].email
            });
        }).catch(err => {
            console.log(err);
        })

        const cookie = {
            user_id: Cookie.get('user_id')
        };
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post('/api/my-debts', qs.stringify(cookie), config)
            .then(res => {
                console.log(res);
                this.setState({
                    debtData: res.data
                });
            }).catch(err => {
                console.log(err);
            });
    };

    deleteDebt(id) {
        axios.delete('/api/delete-debts/' + id)
            .then(response => console.log(response.data)).then(() => {
                const cookie = {
                    user_id: Cookie.get('user_id')
                };
                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                axios.post('/api/my-debts', qs.stringify(cookie), config)
                    .then(res => {
                        console.log(res);
                        this.setState({
                            debtData: res.data
                        });
                    }).catch(err => {
                        console.log(err);
                    });
            });
    };

    handleChange (e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    // for selecting rewards
    handleChangeSelectReward(e) {
        this.setState({ reward: e.target.value });
    }

    // for selecting offererEmail
    handleChangeSelectOffererEmail(e) {
        this.setState({ offererEmail: e.target.value });
    }

    // this function is use when user submit a form
    onSubmit(e) {
        e.preventDefault();
        if(this.state.description.length !== 0 && Number(this.state.quantity) > 0) {
            const debt = {
                description: this.state.description,
                reward: this.state.reward,
                quantity: this.state.quantity,
                offererEmail: this.state.offererEmail,
                user_id: Cookie.get('user_id')
            };
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            axios.post('/api/add-my-debts', qs.stringify(debt), config)
                .then(res => console.log(res.data)).then(() => {
                    const cookie = {
                        user_id: Cookie.get('user_id')
                    };
                    const config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };
                    axios.post('/api/my-debts', qs.stringify(cookie), config)
                        .then(res => {
                            console.log(res);
                            this.setState({
                                debtData: res.data
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                });
        } else if (Number(this.state.quantity) <= 0 || Number(this.state.quantity) == null) {
            alert("The reward quantity should be larger than 0.")
        } else {
            alert("Please fill all the fields");
        }
        

    }

    render() {
        return (
            <body>
                <div className="debt-container">
                    <section className='jumbotron text-centre'>
                        <h1 className='leaderboard-title'>My Debts</h1>
                    </section>
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>Debt ID</th>
                                <th>Debtor</th>
                                <th>Description</th>
                                <th>Reward</th>
                                <th>Quantity</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.debtData.map((debtData) =>
                                    <tr>
                                        <td>{debtData.id}</td>
                                        <td>{debtData.fullname}</td>
                                        <td>{debtData.description}</td>
                                        <td>{debtData.rewardName}</td>
                                        <td>{debtData.quantity}</td>
                                        <td>
                                            <button onClick={() => this.deleteDebt(debtData.id)}>Pay</button>
                                        </td>
                                    </tr>
                                )}
                        </tbody>

                    </table>
                </div>
                <main>
                    <div className='add-debt-box'>
                        <form onSubmit={this.onSubmit}>
                            <h1 className='addDebt'>Create a Debt</h1>
                            <br></br>
                            <div>
                                <p>User's ID</p>
                                <select value={this.state.offererEmail} className='form-control1' onChange={this.handleChangeSelectOffererEmail}>
                                    {
                                        this.state.userIdData.map((userIdData) =>
                                            <option>{userIdData.email}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <br></br>
                            <div>
                                <p>Description</p>
                                <textarea type='description' value={this.state.description} id='description' name='description' className='form-control1' required='true' onChange={this.handleChange} />
                            </div>
                            <br></br>
                            <div>
                                <p>Reward</p>
                                <select value={this.state.reward} className='form-control1' onChange={this.handleChangeSelectReward}>
                                    {
                                        this.state.rewardData.map((rewardData) =>
                                            <option>{rewardData.rewardName}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <br></br>
                            <div>
                                <p>Reward (Quantity)</p>
                                <input type='text' value={this.state.quantity} name='quantity' className='form-control1' required='true' onChange={this.handleChange} />
                            </div>
                            <br></br>

                            <div className='btn-signup'>
                                <button className='btn-signup'>Create a new debt</button>
                            </div>
                        </form>
                    </div>
                </main>
            </body>
        );
    };
};

