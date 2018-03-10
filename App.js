import React from 'react';
import { Button, Text, View, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, WebView} from 'react-native';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json

class HomeScreen extends React.Component {
  
  static navigationOptions = {
        title: 'Twitch Live Streams',
        headerTitleStyle :{textAlign: 'center', alignSelf:'center', color: '#6441a5'},
        headerStyle:{
            margin: 0,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center'
        },
    };
  
  constructor(props) {
    super(props); 
    this.state = { text: 'overwatch', streams: [] };
    this.Search()
  }
  
  Search = () => {
    console.log(this.state.text);
    var query = encodeURI(this.state.text);
    fetch(`https://api.twitch.tv/kraken/search/streams?q=${query}&limit=100&client_id=hqtr6w669ykfhj1oawpvh6fgnizcwh`)
      .then(function(response) {
        return response.json();
      })
      .then((myJson) => {
        console.log('myJson');
        this.setState({
          streams: myJson
        });
      });
  }
  
  render() {
    return (
      <View style={styles.container}>

        <View style={{flexDirection: 'row', width: window.width, margin: 10, padding: 0, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#888', borderRadius:10, backgroundColor:'#fff'}}>
          <View style={{flex:4}}>
            <TextInput style={{padding: 10}}
                onChangeText={(text) => this.setState({text})}
                placeholder="Search Stream..."
                onSubmitEditing={this.Search}
                value={this.state.text}
            />
          </View>
          <View style={{flex:1.2, backgroundColor: '#6441a5', borderBottomRightRadius: '6px', borderTopRightRadius: '6px'}}>
            <Button color='white' title= 'Search' onPress={this.Search}>
            </Button>
          </View>
        </View>


      <ScrollView style={{ width: '95%'}}>
      {this.state.streams.streams && this.state.streams.streams.map(stream => (
        <TouchableOpacity style={styles.element} onPress={() => this.props.navigation.navigate('Details', {
          watch : `https://www.twitch.tv/${stream.channel.name}`
        }
        )}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex:4, padding: 10, }}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#3f3f3f'}}>
              /{stream.channel.name}
            </Text>
            <Text style={{fontWeight: 'italic', fontSize: 14, color: '#3f3f3f'}}>
               Game: {stream.game}
            </Text>
            <Text style={{fontWeight: 'italic', fontSize: 14, color: '#3f3f3f'}}>
              Viewers: {stream.viewers}
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'flex-end'}}>
              <Image
                source={{ uri: stream.preview.large }}
                style={{ height: '100%', width: 105}}
              />
          </View>
        </View>
        

          
        </TouchableOpacity>
        ))}
        </ScrollView>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  
  render() {
    
    const { params } = this.props.navigation.state;
    const watch = params ? params.watch : null;
    console.log(watch);
    return (
      <View  style={{height: '100%', borderColor: 'gray', borderWidth: 1, width: '100%'}}>
        <WebView
              source={{uri: watch}}
              style={{marginTop: 0}}
            />
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
  },
  element: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: 'rgba(181, 181, 181, 0.5)',
    margin: 6,
    borderWidth: 1,
    borderColor: 'rgba(181, 181, 181, 0.9)',
    borderRadius: 2
  },

});