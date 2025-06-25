import React, {JSX} from 'react';
import ContentBlock from './contentBlock';
import TextFeedback from './textFeedback';
import {IMessage} from '../../types/types';
import {IConversationState} from '../../types/types';
import {useAppSelector} from '../../app/hooks';
import {PERFECT_SCORE} from '../../constants/const';

interface ConversationProps {
  conversation: IConversationState;
}

const Conversation: React.FC<ConversationProps> = ({
  conversation,
}): JSX.Element => {
  const settings = useAppSelector(state => state.settings);
  const {userAvatar, botAvatar} = settings;
  return (
    <>
      {conversation.messages.map((item: IMessage, i) => {
        const isPerfect = item?.rating === PERFECT_SCORE;
        const hasErrors = item?.rating && item.errors && item.errors.length > 0;
        return (
          <React.Fragment key={i}>
            <ContentBlock
              message={item}
              avatarSrc={item.isBot ? botAvatar : userAvatar}
              isLastMessage={i === conversation.messages.length - 1}
            />
            {isPerfect && (
              <TextFeedback
                rating={item.rating}
                text="Excellent! Great reply"
              />
            )}
            {hasErrors && (
              <TextFeedback rating={item.rating} text={item.errors} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Conversation;
