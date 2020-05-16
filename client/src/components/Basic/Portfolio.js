import React, {Component} from 'react';
import {Button, Card, ListGroup} from "react-bootstrap";
import {Redirect} from 'react-router';
import {getPortfolioCard, getStockList, getStrategyLogo} from "./UtilFunctions";
import {getStockSuggestion, getPortfolioInfo} from "../../redux/actions/stockActions";
import {connect} from "react-redux";


function mapStateToProps(store) {
    return {
        stockSuggestions: store.stocks.stockSuggestions,
        portfolioInfo: store.stocks.portfolioInfo,
        portfolioValue: store.stocks.portfolioValue,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getStockSuggestion: (payload) => dispatch(getStockSuggestion(payload)),
        getPortfolioInfo: (payload) => dispatch(getPortfolioInfo(payload)),
    };
}

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBuyPage: null,
        }
    }

    getMSLFromLocalStorage = () => {
        const mainStrategyList = JSON.parse(localStorage.getItem("mainStrategyList"));
        return mainStrategyList ? mainStrategyList : [];
    }

    getStockSuggestions = () => {
        const mainStrategyList = JSON.parse(localStorage.getItem("dataWithDivision"));
        return mainStrategyList ? mainStrategyList : [];
    }

    componentDidMount() {
        console.log("names")
        console.log(this.getMSLFromLocalStorage().map(strategy => strategy.name));

        const payload = {};
        payload.choices = this.getMSLFromLocalStorage().map(strategy => strategy.name);

        if (!localStorage.getItem("dataWithDivision")) {
            this.props.getStockSuggestion(payload);
        }
    }

    getPortfolio() {
        console.log("this.props.stockSuggestions")
        console.log(this.props.stockSuggestions)
        const stockSuggestions = this.getStockSuggestions()

        if (stockSuggestions.length === 0) return null;

        const renderTodos = stockSuggestions.suggestions.map((suggestion, index) => {
            return getPortfolioCard(suggestion.strategy, index, stockSuggestions.suggestions, stockSuggestions.division)
        });


        return <div>
            <Card style={{width: '22rem'}}>
                <Card.Body>
                    <Card.Title>Portfolio overview</Card.Title>
                    <Card.Text>
                        <b>Current value - {this.props.portfolioValue}</b>
                    </Card.Text>
                </Card.Body>
            </Card>

            <ListGroup horizontal>{renderTodos}</ListGroup>
        </div>
    }

    render() {
        return (
            <div>
                {this.state.redirectToBuyPage === true && <Redirect to={{
                    pathname: "/basic/buy/"
                }}/>}

                <h1>Portfolio HomePage</h1>
                {this.getMSLFromLocalStorage().length === 0 &&
                <Button variant="primary" style={styles.button}
                        onClick={() => this.setState({redirectToBuyPage: true})}>
                    Create Portfolio
                </Button>}

                {this.getMSLFromLocalStorage().length !== 0 && this.getPortfolio()}
            </div>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    button: {
        width: "10%",
        marginRight: "45%"
    },
    storeList: {
        flex: 2,
        alignSelf: 'left'
    },
    formField: {
        marginLeft: "1rem",
        marginRight: "1rem"
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);