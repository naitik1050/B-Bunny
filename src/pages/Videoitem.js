import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe";


const Videoitem = ({ videoId, onPress }) => {
    const [videoMeta, setVideoMeta] = useState(null);
    useEffect(() => {
        getYoutubeMeta(videoId).then((data) => {
            setVideoMeta(data);
        });
    }, [videoId]);




    if (videoMeta) {
        return (
            <TouchableOpacity
                onPress={() => onPress(videoId)}
                style={{ flexDirection: "row", marginVertical: 16 }}
            >
                <Image
                    source={{ uri: videoMeta.thumbnail_url }}
                    style={{
                        width: videoMeta.thumbnail_width / 4,
                        height: videoMeta.thumbnail_height / 4,
                    }}
                />
                <View style={{ justifyContent: "center", marginStart: 16 }}>
                    <Text style={{ marginVertical: 4, fontWeight: "bold" }}>
                        {videoMeta.title}
                    </Text>
                    <Text>{videoMeta.author_name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    return null;
};

export default Videoitem
