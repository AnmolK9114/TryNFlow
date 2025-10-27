import cv2
import mediapipe as mp
import numpy as np
from PIL import Image

mp_pose = mp.solutions.pose

def detect_garment_type(garment_path):
    """Very simple garment type detector based on filename and aspect ratio."""
    garment = Image.open(garment_path)
    w, h = garment.size
    aspect_ratio = h / w

    # Basic keyword-based check
    name = garment_path.lower()
    if "dress" in name or aspect_ratio > 1.4:
        return "dress"
    elif "shirt" in name or "top" in name:
        return "shirt"
    elif "jacket" in name or "coat" in name:
        return "jacket"
    else:
        # Fallback based on height
        return "shirt" if aspect_ratio < 1.2 else "dress"

def auto_overlay(user_img_path, garment_img_path, output_path="output_v4.png"):
    user = cv2.imread(user_img_path)
    user_h, user_w, _ = user.shape

    pose = mp_pose.Pose(static_image_mode=True, model_complexity=2)
    results = pose.process(cv2.cvtColor(user, cv2.COLOR_BGR2RGB))

    if not results.pose_landmarks:
        print("❌ Pose landmarks not detected!")
        return

    lm = results.pose_landmarks.landmark

    # Key points for alignment
    LShoulder = (int(lm[11].x * user_w), int(lm[11].y * user_h))
    RShoulder = (int(lm[12].x * user_w), int(lm[12].y * user_h))
    LHip = (int(lm[23].x * user_w), int(lm[23].y * user_h))
    RHip = (int(lm[24].x * user_w), int(lm[24].y * user_h))

    # Torso width and height between shoulders–hips
    torso_width = int(np.linalg.norm(np.array(LShoulder) - np.array(RShoulder)))
    torso_height = int(((np.linalg.norm(np.array(LShoulder) - np.array(LHip)) +
                         np.linalg.norm(np.array(RShoulder) - np.array(RHip))) / 2))

    print(f"Detected torso width: {torso_width}px, height: {torso_height}px")

    # Load and resize garment
    garment = Image.open(garment_img_path).convert("RGBA")

    # ✅ Natural AI scaling (no more stretching)
    # Detect garment type
    garment_type = detect_garment_type(garment_img_path)
    print(f"🧥 Detected garment type: {garment_type}")
    if garment_type == "shirt":
        garment_width = int(torso_width * 2.1)
        garment_height = int(torso_height * 1.4)
    elif garment_type == "dress":
        garment_width = int(torso_width * 2.1)
        garment_height = int(torso_height * 2.2)
    elif garment_type == "jacket":
        garment_width = int(torso_width * 1.3)
        garment_height = int(torso_height * 1.4)
    else:
        garment_width = int(torso_width * 1.2)
        garment_height = int(torso_height * 1.6)

    garment = garment.resize((garment_width, garment_height), Image.LANCZOS)

    # Center the garment between shoulders
    x_center = int((LShoulder[0] + RShoulder[0]) / 2)
    y_top = min(LShoulder[1], RShoulder[1]) - int(0.23 * torso_height)  # slight upward offset

    x_offset = x_center - garment_width // 2
    if garment_type == "dress":
        y_offset = y_top - int(torso_height * 0.001)  # start a bit higher for long garments
    else:
        y_offset = y_top


    # Overlay
    user_pil = Image.fromarray(cv2.cvtColor(user, cv2.COLOR_BGR2RGBA))
    user_pil.paste(garment, (x_offset, y_offset), garment)
    user_pil.save(output_path)

    print(f"✅ Perfect AI overlay saved at: {output_path}")
    print(f"Overlay position: ({x_offset}, {y_offset}) | Garment size: {garment_width}x{garment_height}")

if __name__ == "__main__":
    user_path = "user_image.png"
    garment_path = "garment_image.png"
    auto_overlay(user_path, garment_path)
