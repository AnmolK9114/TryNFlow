import cv2
import mediapipe as mp
import numpy as np
from PIL import Image

mp_pose = mp.solutions.pose

def auto_overlay(user_img_path, garment_img_path, output_path="output.png"):
    # Load user and garment
    user = cv2.imread(user_img_path)
    garment = Image.open(garment_img_path).convert("RGBA")
    user_h, user_w, _ = user.shape

    pose = mp_pose.Pose(static_image_mode=True, model_complexity=2)
    results = pose.process(cv2.cvtColor(user, cv2.COLOR_BGR2RGB))

    if not results.pose_landmarks:
        print("❌ No human pose detected!")
        return

    landmarks = results.pose_landmarks.landmark

    # --- Get key landmarks ---
    left_shoulder = np.array([landmarks[11].x * user_w, landmarks[11].y * user_h])
    right_shoulder = np.array([landmarks[12].x * user_w, landmarks[12].y * user_h])
    left_hip = np.array([landmarks[23].x * user_w, landmarks[23].y * user_h])
    right_hip = np.array([landmarks[24].x * user_w, landmarks[24].y * user_h])

    # --- Compute torso dimensions ---
    torso_width = int(np.linalg.norm(left_shoulder - right_shoulder))
    torso_height = int(np.linalg.norm(left_shoulder - left_hip))
    shoulder_center = (int((left_shoulder[0] + right_shoulder[0]) / 2),
                       int((left_shoulder[1] + right_shoulder[1]) / 2))

    print(f"Detected torso width: {torso_width}px, height: {torso_height}px")

    # --- Determine garment type from aspect ratio ---
    aspect_ratio = garment.height / garment.width
    print(f"Garment aspect ratio: {aspect_ratio:.2f}")

    if aspect_ratio > 1.4:  # dress
        width_scale = 2.0    # Wider horizontally for natural fit
        height_scale = 2.2   # Longer for dress proportions
        y_offset_adjust = -0.23  # Move upward slightly
    else:  # shirt/top
        width_scale = 2.1    # Wider shoulders for shirts
        height_scale = 1.3
        y_offset_adjust = -0.25

    garment_width = int(torso_width * width_scale)
    garment_height = int(torso_height * height_scale)

    garment = garment.resize((garment_width, garment_height), Image.LANCZOS)

    # --- Overlay position ---
    x_center = shoulder_center[0]
    y_start = int(shoulder_center[1] + (y_offset_adjust * torso_height))

    x_offset = max(0, x_center - garment_width // 2)
    y_offset = max(0, y_start)

    # --- Alpha blending overlay ---
    user_pil = Image.fromarray(cv2.cvtColor(user, cv2.COLOR_BGR2RGBA))
    user_pil.paste(garment, (x_offset, y_offset), garment)
    user_pil.save(output_path)

    print("✅ Smart garment overlay complete:", output_path)


if __name__ == "__main__":
    user_path = "user_image.png"
    garment_path = "garment_image.png"
    output_path = "result.png"
    auto_overlay(user_path, garment_path, output_path)
