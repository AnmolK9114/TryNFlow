from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import HTMLResponse, Response, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import tempfile, os
from smart_overlayq import auto_overlay

# 🚀 FastAPI App Setup
app = FastAPI(title="Virtual Try-On SaaS")

# ✅ Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during development allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📂 Define base, static, and template dirs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
GARMENT_DIR = os.path.join(STATIC_DIR, "garments")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# 🏠 Homepage Route
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    # Fetch all catalogue image names
    garment_items = [
        f"/static/garments/{img}"
        for img in os.listdir(GARMENT_DIR)
        if img.lower().endswith((".png", ".jpg", ".jpeg"))
    ]
    return templates.TemplateResponse(
        "index.html", {"request": request, "garment": garment_items}
    )

# 👗 Try-On Route (Supports catalogue or manual garment)
@app.post("/tryon")
async def tryon(
    user_image: UploadFile = File(...),
    garment_image: UploadFile | None = File(None),
    selected_catalogue: str | None = Form(None),
):
    user_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    user_temp.write(await user_image.read())
    user_temp.close()

    # Determine garment source: uploaded OR catalogue
    if garment_image:
        garment_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        garment_temp.write(await garment_image.read())
        garment_temp.close()
        garment_path = garment_temp.name
    elif selected_catalogue:
        garment_path = os.path.join(BASE_DIR, selected_catalogue.strip("/"))
    else:
        return JSONResponse({"error": "No garment selected or uploaded."}, status_code=400)

    output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")

    try:
        auto_overlay(user_temp.name, garment_path, output_temp.name)
    except Exception as e:
        print("❌ AI Overlay Error:", e)
        return JSONResponse({"error": str(e)}, status_code=500)

    with open(output_temp.name, "rb") as f:
        result_bytes = f.read()

    return Response(content=result_bytes, media_type="image/png")
