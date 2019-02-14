import React, { Component } from 'react';
import {
  StyleSheet, 
  Platform, 
  Modal, 
  Image
} from 'react-native';
import { Spinner, Text, View, Content, Container, Header, Item, Button, Icon, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3, Left, Body, Right } from 'native-base';


export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      search: 'moneywise', 
      modalVisible: false,
      selectedItem: undefined,
      results: {
        items: []
      }
    }
  this.search = this.search.bind(this);
  }

  setModalVisible(visible, item){
    this.setState({
      modalVisible: visible, 
      selectedItem: item
    });
  }

  search(){
    this.setState({
      loading: true
    });

    return fetch('https://api.github.com/search/repositories?q='+this.state.search)
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                results: responseJson, 
                loading: false
              });

              return responseJson.Search;
            })
            .catch((error) => {
              this.setState({
                loading: false
              });
              console.error(error);
            })
  }

  render(){
    return(
      <Container>
       <Header searchBar rounded>
          <Item>
              <Input placeholder="Search" value={this.state.search} onChangeText={(text) => this.setState({search:text})} onSubmitEditing={() => this.search()}/>
              <Button transparent onPress={()=>this.search()}><Icon name='ios-search' /></Button>
          </Item>
          
        </Header>
        <Content>
          {this.state.loading ? <Spinner /> : 
            <List dataArray={this.state.results.items} renderRow={(item) => 
              <ListItem thumbnail>
                  <Left>
                    <Thumbnail square size={80} source={{uri: item.owner.avatar_url}} />
                  </Left>

                  <Body>
                    <Text>Name: <Text style={{fontWeight: '600', color: '#46ee4b'}}>{item.name}</Text></Text>
                    <Text style={{color: '#007594' }}>{item.full_name}</Text>
                    <Text note>Score: <Text note style={{marginTop: 5}}>{item.score}</Text></Text>
                  </Body>

                  <Right>
                    <Button transparent onPress={() => {this.setModalVisible(true, item)}}>
                      <Text>View</Text>
                    </Button>
                  </Right>
              </ListItem>
          }/>}

          <Modal 
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible} 
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
            <Button danger style={{alignSelf: 'flex-end'}} onPress={() => {
                    this.setModalVisible(!this.state.modalVisible, this.state.selectedItem)
                }}>
                <Text>Go Back</Text>
            </Button>

              {!this.state.selectedItem ? <View /> :
                <Card style={{paddingTop: 20}}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={{uri: this.state.selectedItem.owner.avatar_url}}/>
                      <Body>
                        <Text>{this.state.selectedItem.name}</Text>
                        <Text note>{this.state.selectedItem.full_name}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody style={{justifyContent: 'flex-start'}}>
                    <Image source={{uri: this.state.selectedItem.owner.avatar_url}} style={styles.modalImage}/> 
                  </CardItem>
                  <CardItem bordered>
                    <Left>
                      <Body>
                        <H3 style={styles.header}> {this.state.selectedItem.name} </H3>
                        <Text>
                            Type: <Text style={styles.bold}>{this.state.selectedItem.owner.type}</Text>
                        </Text>
                        <Text>
                            Stars: <Text style={styles.bold}>{this.state.selectedItem.stargazers_count}</Text>
                        </Text>
                        <Text>
                            Language: <Text style={styles.bold}>{this.state.selectedItem.language}</Text>
                        </Text>
                        <Text>
                            Open Issues: <Text style={styles.bold}>{this.state.selectedItem.open_issues_count}</Text>
                        </Text>
                        <Text>
                            Last Update: <Text style={styles.bold}>{this.state.selectedItem.updated_at.slice(0,10)}</Text>
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
                
              }

          </Modal>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginLeft: -5, 
    marginTop: 5, 
    marginBottom: (Platform.OS === 'ios') ? -7 : 0, 
    lineHeight: 24, 
    color: '#5357b6'
  }, 
  modalImage:{
    resizeMode: 'contain', 
    height: 200,
    width: null, 
    flex: 1
  }, 
  negativeMargin: {
    marginBottom: -10
  },
  bold: {
    fontWeight: '600'
  },

});

