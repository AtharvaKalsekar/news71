import { Card } from '@components';
import { Article } from '@models';
import { Box, Text } from 'native-base';
import { Image, StyleSheet } from 'react-native';

type Props = {
  story: Article;
};

export const TopStoriesListItem = ({ story }: Props) => {
  return (
    <Card
      style={style.itemContainer}
      _light={{
        backgroundColor: "white",
        _text: { color: "black" },
        borderColor: "gray.400",
      }}
      _dark={{
        backgroundColor: "gray.700",
        _text: { color: "white" },
        borderColor: "gray.600",
      }}
    >
      <Box>
        <Image
          source={{
            uri: story.multimedia?.[0]?.url,
          }}
          style={style.image}
        />
      </Box>
      <Box
        style={style.textContainer}
        _light={{ backgroundColor: "white" }}
        _dark={{ backgroundColor: "gray.800" }}
      >
        <Text
          style={style.title}
          _light={{ color: "black" }}
          _dark={{ color: "white" }}
        >
          {story.title}
        </Text>
      </Box>
    </Card>
  );
};

const style = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    borderRadius: 15,
    marginVertical: 3,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: 150,
    height: 150,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    padding: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 3,
  },
});
