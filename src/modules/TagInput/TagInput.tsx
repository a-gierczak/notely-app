import React from 'react';
import R from 'ramda';
import debounce from 'lodash/debounce';
import { Tag } from 'src/types/common';
import { findTags } from './reducers/tagInputActions';
import { AppState } from 'src/types/state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import { ModalInput } from 'UI/components/ModalInput';

interface DispatchProps {
  findTagsAction: typeof findTags;
}

interface ConnectedProps {
  tags: Tag[] | null;
}

interface OwnProps {
  onTagsChange: (tags: string) => void;
}

interface State {
  inputValue: string;
}

class TagInputBase extends React.Component<
  OwnProps & DispatchProps & ConnectedProps
> {
  state: State = {
    inputValue: '',
  };

  debouncedFindTags = debounce(
    (tags: string) => this.props.findTagsAction(tags),
    200,
  );

  handleTagTextChange = (inputValue: string) => {
    this.setState({ inputValue });
    const lastTagQuery = R.last(inputValue.split(' ')) || '';
    this.debouncedFindTags(lastTagQuery);
  }

  handleTagHintSelect = (tag: Tag) => () => {
    const tagsWithoutLast = R.dropLast(1, R.split(' ', this.state.inputValue));
    const tagText = R.join(' ', R.concat(tagsWithoutLast, [tag.name, '']));

    this.handleTagTextChange(tagText);
  }

  render() {
    const { inputValue } = this.state;
    const { tags } = this.props;

    return (
      <ModalInput
        value={inputValue}
        onTextChange={this.handleTagTextChange}
        placeholder="Tags"
        onModalHide={() => this.props.onTagsChange(inputValue)}
      >
        {R.map(
          (tag: Tag) => (
            <ListItem
              key={tag.id}
              onPress={this.handleTagHintSelect(tag)}
              title={`#${tag.name}`}
            />
          ),
          tags || [],
        )}
      </ModalInput>
    );
  }
}

const mapStateToProps = (state: AppState): ConnectedProps => ({
  tags: state.tagInput.tags,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      findTagsAction: findTags,
    },
    dispatch,
  ),
});

export const TagInput = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagInputBase);
