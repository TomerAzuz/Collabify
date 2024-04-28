import { useSlateStatic, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';

import UrlInput from './UrlInput';

const VideoElement = (props) => {
  const editor = useSlateStatic();
  const { element } = props;
  const { url } = element;

  const getYouTubeId = (videoUrl) => {
    if (!videoUrl) return null; 
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(regex);
    return match ? match[1] : null;
  };

  const constructYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const videoId = getYouTubeId(url);
  const embedUrl = videoId ? constructYouTubeEmbedUrl(videoId) : null;

  return (
    embedUrl && (
      <div {...props.attributes}>
        <div contentEditable={false}>
          <div
            style={{
              padding: '75% 0 0 0',
              position: 'relative',
            }}
          >
            <iframe
              title="YouTube Video"
              src={embedUrl}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <UrlInput 
            url={url}
            onChange={val => {
              const path = ReactEditor.findPath(editor, element);
              const newProps = {
                url: val,
              }
              Transforms.setNodes(editor, newProps, {
                at: path,
              })
            }}
          />
        </div>
        {props.children}
      </div>
    )
  );
};

export default VideoElement;
