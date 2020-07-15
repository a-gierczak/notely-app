import R from 'ramda';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationScreenConfig,
} from 'react-navigation';
import { createPost } from 'src/modules/Post/reducers/postActions';
import { AppState } from 'src/types/state';
import { Loader } from 'src/modules/UI/components/Loader';
import { CapturedImage } from 'src/modules/CreatePost/components/Camera';
import { Color } from 'src/modules/UI/styles';
import { BackButtonHeader } from 'src/modules/UI/components/BackButtonHeader';
import { ValidatedInput } from 'src/modules/UI/components/ValidatedInput';
import { ValidationError, Tag } from 'src/types/common';
import { TagSuggestions } from 'src/modules/UI/components/TagSuggestions';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Color.Background,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {},
  inputWrapper: {
    borderColor: '#d2d3cf',
    width: '100%',
  },
  inputTallContainer: {
    minHeight: 200,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  topRow: {
    flexDirection: 'row',
  },
  previewSize: {
    width: 100,
    height: 100,
  },
  previewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    flexBasis: 100,
    marginRight: 10,
  },
  formContainer: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preview: {
    resizeMode: 'cover',
  },
});

interface State {
  description?: string;
  name?: string;
  tags?: string;
}

interface OwnProps {
  navigation: NavigationScreenProp<
    NavigationState,
    {
      image?: CapturedImage;
    }
  >;
}

interface DispatchProps {
  createPostAction: typeof createPost;
}

interface ConnectedProps {
  creatingPost: boolean; // TODO: remove
  validationErrors?: ValidationError[];
  fileName?: string;
}

class CreatePostBase extends React.Component<
  OwnProps & DispatchProps & ConnectedProps,
  State
> {
  static navigationOptions: NavigationScreenConfig<void> = () => ({
    header: null,
  })

  state: State = {};

  handleSubmit = async () => {
    const { description, tags, name } = this.state;
    const { navigation, fileName } = this.props;
    const image = navigation.getParam('image');

    if (!image) {
      return;
    }

    this.props.createPostAction({
      tags,
      description,
      name,
      image,
      fileName,
    });
  }

  handleSelectTag = (tag: Tag) => {
    const tags = R.pipe(
      R.trim,
      R.split(' '),
      R.dropLast(1),
      R.append(tag.name),
      R.join(' '),
    )(this.state.tags || '');

    this.setState({ tags });
  }

  render() {
    const { creatingPost, navigation, validationErrors } = this.props;
    const image = navigation.getParam('image');

    if (!image) {
      return null;
    }

    return (
      <>
        <BackButtonHeader
          backgroundColor={Color.Background}
          navigation={navigation}
          rightIcon="check"
          onRightIconPress={this.handleSubmit}
        />

        {creatingPost && <Loader />}

        <View style={styles.screen}>
          <Text h3 style={styles.title}>
            New post
          </Text>

          <View style={styles.card}>
            <View style={styles.topRow}>
              <Image
                containerStyle={[styles.previewContainer, styles.previewSize]}
                style={[styles.preview, styles.previewSize]}
                source={{ uri: image.uri }}
              />
              <View style={styles.formContainer}>
                <ValidatedInput
                  validationName="name"
                  validationMessages={validationErrors}
                  placeholder="Title"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.inputWrapper}
                  placeholderTextColor="#d2d3cf"
                  style={styles.input}
                  onChangeText={name => this.setState({ name })}
                  value={this.state.name}
                  focusedBorderColor={Color.MediumGrey}
                />
                <ValidatedInput
                  validationName="tags"
                  validationMessages={validationErrors}
                  placeholder="Tags"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.inputWrapper}
                  placeholderTextColor="#d2d3cf"
                  style={styles.input}
                  onChangeText={tags => this.setState({ tags })}
                  value={this.state.tags}
                  focusedBorderColor={Color.MediumGrey}
                />
              </View>
            </View>
            <TagSuggestions search={this.state.tags} onSelect={this.handleSelectTag} />
            <ValidatedInput
              validationName="description"
              validationMessages={validationErrors}
              placeholder="Description"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputWrapper}
              placeholderTextColor="#d2d3cf"
              style={styles.input}
              onChangeText={description => this.setState({ description })}
              value={this.state.description}
              focusedBorderColor={Color.MediumGrey}
              multiline
            />
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state: AppState): ConnectedProps => ({
  creatingPost: state.post.creatingPost,
  validationErrors: state.post.errors,
  fileName: state.post.fileName,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      createPostAction: createPost,
    },
    dispatch,
  );

export const CreatePost = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostBase);
