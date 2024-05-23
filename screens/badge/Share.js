import React from "react";
import { Share as ShareAction } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ShareUrl } from "../../utils/http/http";

export default class Share extends React.Component {
  static async share(content) {
    try {
      const result = await ShareAction.share(
        {
          message: content,
        },
        { dialogTitle: "partager", subject: "Partager" }
      );
      if (result.action === ShareAction.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === ShareAction.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  } /*Télécharger action map  "https://google-play-store-link-here.test" */
  static async shareIncident(id) {
    try {
      const result = await ShareAction.share(
        {
          message: `${ShareUrl}/api/incidentmap/${id}/`,
        },
        { dialogTitle: "partager", subject: "partager" }
      );
      if (result.action === ShareAction.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === ShareAction.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  } /*Télécharger action map  "https://google-play-store-link-here.test" */
  static async shareChallenge(id) {
    try {
      const result = await ShareAction.share(
        {
          message: `${ShareUrl}/api/challengemap/${id}/`,
        },
        { dialogTitle: "partager", subject: "partager" }
      );
      if (result.action === ShareAction.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === ShareAction.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  } /*Télécharger action map  "https://google-play-store-link-here.test" */
  render() {
    const {
      title,
      content,
      id,
      url,
      incident,
      challenge,
      small = true,
      color = "#000",
      style = {},
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          if (incident) {
            Share.shareIncident(id);
          } else if (challenge) {
            Share.shareChallenge(id);
          } else {
            Share.share(title, content, url);
          }
        }}
        style={{ padding: 5, ...style }}
      >
        <Icon size={small ? 20 : 30} name="share" color={color} />
      </TouchableOpacity>
    );
  }
}
