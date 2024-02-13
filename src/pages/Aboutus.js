import React, { PureComponent } from 'react';
import { Text, View, Dimensions, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Button, Left, Right, Header, Body } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faList } from '@fortawesome/free-solid-svg-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';
import { Dialog } from 'react-native-simple-dialogs';
import YouTube from 'react-native-youtube';
import SideMenuDrawer from '../component/SideMenuDrawer';

var { height, width } = Dimensions.get('window');
export default class Aboutus extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            warrendata: "",
            token: '',
            loginmodal: false,
            logintext: "",
            isReady: false,
            status: null,
            quality: null,
            error: null,
            isPlaying: false,
            isLooping: true,
            duration: 0,
            currentTime: 0,
            fullscreen: false,
        };
        this.getRecentWarrens();
    }

    _youTubeRef = React.createRef();

    opendrawer = () => {
        if (this.state.token == "") {
            this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
        }
        else {
            this._sideMenuDrawer.open()
        }
    }

    getRecentWarrens = () => {

        if (this.state.token == "") {
            fetch(Endpoint.endPoint.url + Endpoint.endPoint.most_visited_warrens, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log("all new responseJson About====>", responseJson)
                    if (responseJson.status == true) {
                        this.setState({ warrendata: responseJson.data });
                    } else if (responseJson.status == false) {
                        console.log("response", responseJson);
                    } else {
                        alert('Something went wrong');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    warrensclicked = item => {
        if (this.props.parent == undefined) {
            this.props.navigation.navigate('warrenPost', { warrenId: item.id, warrenName: item.name });
        } else {
            this.propsparent(id);
        }
    };

    login = () => {
        this.setState({ loginmodal: false });
        this.props.navigation.navigate('login');
    }

    register = () => {
        this.setState({ loginmodal: false });
        this.props.navigation.navigate('registration');
    }

    render() {
        var left = <Left style={{ flex: 0.2 }} />;
        var right = (
            <Right style={{ flex: 0.2 }}>
                <Button onPress={() => { this.opendrawer() }} transparent>
                    <FontAwesomeIcon
                        icon={faBars}
                        color={'white'}
                        size={height > width ? wp('5.5%') : wp('2.5%')}
                    />
                </Button>
            </Right>
        );

        return (
            // <SideMenuDrawer
            //     ref={ref => (this._sideMenuDrawer = ref)}
            //     style={{ zIndex: 1 }}
            //     navigation={this.props}>
            <View style={{ flex: 1 }}>

                <Dialog
                    dialogStyle={{
                        justifyContent: width > height ? 'center' : null,
                        alignSelf: width > height ? 'center' : null,
                        width: width > height ? wp('60%') : null,
                        padding: width > height ? 15 : 0
                    }}
                    titleStyle={{
                        color: '#212121',
                        fontSize: height > width ? wp('5.6%') : wp('3.5%'),
                    }}
                    visible={this.state.loginmodal}
                    title="Sign In"
                    onTouchOutside={() => {
                        this.setState({ loginmodal: false });
                    }}
                    onRequestClose={() => {
                        this.setState({ loginmodal: false });
                    }}>
                    <View>
                        <Text style={{ fontSize: width > height ? wp('2.7%') : wp('4.5%'), color: '#757575', lineHeight: width > height ? wp('4.2%') : wp('7%') }}>{this.state.logintext}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: width > height ? 20 : 15 }}>
                            <TouchableOpacity onPress={() => { this.setState({ loginmodal: false }) }} style={{ justifyContent: 'center', marginRight: wp('4%') }}>
                                <Text style={{ color: '#11075e', fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Not Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.login() }} style={{ backgroundColor: '#11075e', borderRadius: 5, paddingHorizontal: 8 }}>
                                <Text style={{ color: 'white', padding: 10, fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Sign In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.register() }} style={{ backgroundColor: '#11075e', borderRadius: 5, paddingHorizontal: 8, marginLeft: 10 }}>
                                <Text style={{ color: 'white', padding: 10, fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>

                <Header style={{ backgroundColor: '#11075e' }}>
                    {left}
                    <Body style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.Scrolloffset();
                            }}>
                            <Image
                                source={require('../images/logo.png')}
                                style={{
                                    height: height > width ? hp('8%') : wp('5%'),
                                    width: height > width ? hp('12%') : wp('10%'),
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </Body>
                    {right}
                </Header>

                <View style={{ backgroundColor: '#5848cf' }}>
                    <FlatList
                        horizontal={true}
                        data={this.state.warrendata}
                        showsHorizontalScrollIndicator={false}
                        showsVerticleScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 5,
                                    paddingHorizontal: 15,
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.warrensclicked(item);
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: height > width ? wp('4%') : wp('2%'),
                                            color: 'white',
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        {item.name.includes('&amp;')
                                            ? item.name.replace('&amp;', '&')
                                            : item.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={({ id }, index) => id}
                    />
                </View>

                <TouchableOpacity
                    style={{
                        padding: 10,
                        margin: 5,
                        backgroundColor: '#11075e',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRightWidth: 1,
                        borderRightColor: 'lightgrey',
                    }}
                    onPress={() => {
                        if (this.state.token == "") {
                            this.props.navigation.navigate("warren")
                        }
                        else {
                            this.setState({ loginmodal: true });
                        }
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <FontAwesomeIcon
                            icon={faList}
                            color={'white'}
                            size={height > width ? wp('5.5%') : wp('3%')}
                            style={{ marginRight: 5 }}
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                color: '#fff',
                                textAlign: 'center',
                                fontSize: height > width ? wp('4%') : wp('1.8%'),
                            }}>
                            Warrens
                            </Text>
                    </View>
                </TouchableOpacity>

                <ScrollView>
                    <View>
                        <Text style={{ fontSize: 19, fontWeight: 'bold', margin: 10, marginBottom: 0 }}>What is Blogs Bunny?</Text>
                        <Text style={{ textAlign: 'justify', margin: 10, marginTop: 5, fontSize: 17 }}>Blogs bunny is a content sharing platform designed for bloggers and media outlets to gain user engagement from high quality articles through our own ranking and machine learning algorithms.</Text>
                    </View>

                    <View>
                        <Text style={{ fontSize: 19, fontWeight: 'bold', margin: 10, marginBottom: 0 }}>Mission Statement</Text>
                        <Text style={{ textAlign: 'justify', margin: 10, marginTop: 5, fontSize: 17 }}>BlogsBunny's primary goal is to fill the gap between what some of the popular social media/content sharing platforms fail to provide. We ensure bloggers are able to promote their own content without being called a "Spammer" or have their reach killed due to fears of "fake news".</Text>
                        <Text style={{ textAlign: 'justify', margin: 10, marginTop: 5, fontSize: 17 }}>The secondary goal is to ensure that only good quality, well written blogs/articles will feature prominently, with additional deciding factors applying other than the traditional up and down voting system. These factors will be:</Text>

                        <View style={{ flexDirection: 'row', margin: 10, marginTop: -20 }}>
                            <Text style={{ fontSize: 25 }}>{'\u2022'}</Text>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 17, marginRight: 10 }}>Grammar/Spell Checker - 1/20</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', margin: 10, marginTop: -10 }}>
                            <Text style={{ fontSize: 25 }}>{'\u2022'}</Text>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 17, marginRight: 10 }}>Plagiarism Checker - 1/20</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', margin: 10, marginTop: -10 }}>
                            <Text style={{ fontSize: 25 }}>{'\u2022'}</Text>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 17, marginRight: 10 }}>Plus/Minus Votes (based on a heat metric) - 1/20</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', margin: 10, marginTop: -10 }}>
                            <Text style={{ fontSize: 25 }}>{'\u2022'}</Text>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 17, marginRight: 10 }}>Website Reputation - 1/20</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', margin: 10, marginTop: -10 }}>
                            <Text style={{ fontSize: 25, }}>{'\u2022'}</Text>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 17, marginRight: 10 }}>Readability - 1/20</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={{ textAlign: 'justify', margin: 10, marginTop: 5, fontSize: 17 }}>The relevance to bunnies is the notion of “disappearing down a rabbit hole”, which in this case is Categories (Warrens), Sub-categories (Burrows) and sub-sub-categories (Rabbit Holes), how deep does the rabbit hole go?. See the video below for further information:</Text>
                    </View>


                    <YouTube
                        ref={this._youTubeRef}
                        apiKey='AIzaSyAhc231NwV6HroLofIb5xvHJpmpBp0f4nk'
                        videoId="naF5bXqPD4k" // The YouTube video ID
                        play={this.state.isPlaying}
                        loop={false}
                        fullscreen={this.state.fullscreen}
                        controls={1}
                        style={[
                            { height: 300, margin: 10 },

                        ]}
                        onError={e => {
                            this.setState({ error: e.error });
                        }}
                        onReady={e => {
                            this.setState({ isReady: true });
                        }}
                        onChangeState={e => {
                            this.setState({ status: e.state });
                        }}
                        onChangeQuality={e => {
                            this.setState({ quality: e.quality });
                        }}
                        onChangeFullscreen={e => {
                            this.setState({ fullscreen: e.isFullscreen });
                        }}
                        onProgress={e => {
                            this.setState({ currentTime: e.currentTime });
                        }}
                    />

                </ScrollView>
            </View>
            // </SideMenuDrawer>
        );
    }


}